import {lex} from "./lexer.js";
import {parse} from "./parser.js";
import {generateRimal} from "./codegen.js";
import {parseEnvironment} from "./environment.js";
import {simulate} from "./simulator.js";
export function compile(source){
 const result=lex(source),diagnostics=[...result.diagnostics],tokens=result.tokens.filter(t=>t.type!=="eof");
 if(diagnostics.some(d=>d.severity==="error"))return {success:false,tokens,ast:null,rimal:"",diagnostics};
 try{const ast=parse(result.tokens);return {success:true,tokens,ast,rimal:generateRimal(ast),diagnostics};}
 catch(e){diagnostics.push(e.diagnostic||{code:"PAR999",severity:"error",message:e.message});return {success:false,tokens,ast:null,rimal:"",diagnostics};}
}
export function run(source,environmentSource){
 const result=compile(source);if(!result.success)return {...result,run:null};
 const parsed=parseEnvironment(environmentSource);result.diagnostics.push(...parsed.diagnostics);if(!parsed.environment)return {...result,success:false,run:null};
 const simulation=simulate(result.ast,parsed.environment);result.diagnostics.push(...simulation.diagnostics);
 return {...result,success:simulation.completed&&!result.diagnostics.some(d=>d.severity==="error"),run:simulation};
}