import {lex} from "./lexer.js";
import {parse} from "./parser.js";
import {generateRimal} from "./codegen.js";
import {parseEnvironment} from "./environment.js";
import {simulate} from "./simulator.js";
function validateProgram(ast){const diagnostics=[],procedures=new Map(ast.procedures.map(p=>[p.name,p]));const visit=body=>{for(const s of body){if(s.type==="call"){const target=procedures.get(s.name);if(!target)diagnostics.push({code:"SEM001",severity:"error",message:"Непозната процедура „"+s.name+"“."});else if(target.params.length!==s.args.length)diagnostics.push({code:"SEM002",severity:"error",message:"Погрешен број аргументи за „"+s.name+"“."});}if(s.body)visit(s.body);}};ast.procedures.forEach(p=>visit(p.body));visit(ast.main.body);return diagnostics;}
export function compile(source){
 const result=lex(source),diagnostics=[...result.diagnostics],tokens=result.tokens.filter(t=>t.type!=="eof");
 if(diagnostics.some(d=>d.severity==="error"))return {success:false,tokens,ast:null,rimal:"",diagnostics};
 try{const ast=parse(result.tokens);diagnostics.push(...validateProgram(ast));if(diagnostics.some(d=>d.severity==="error"))return {success:false,tokens,ast,rimal:"",diagnostics};return {success:true,tokens,ast,rimal:generateRimal(ast),diagnostics};}
 catch(e){diagnostics.push(e.diagnostic||{code:"PAR999",severity:"error",message:e.message});return {success:false,tokens,ast:null,rimal:"",diagnostics};}
}
export function run(source,environmentSource){
 const result=compile(source);if(!result.success)return {...result,run:null};
 const parsed=parseEnvironment(environmentSource);result.diagnostics.push(...parsed.diagnostics);if(!parsed.environment)return {...result,success:false,run:null};
 const simulation=simulate(result.ast,parsed.environment);result.diagnostics.push(...simulation.diagnostics);
 return {...result,success:simulation.completed&&!result.diagnostics.some(d=>d.severity==="error"),run:simulation};
}