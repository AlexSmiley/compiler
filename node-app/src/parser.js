const lower=v=>v.toLocaleLowerCase("mk");
class ParseError extends Error{constructor(token,message){super(message);this.diagnostic={code:"PAR001",severity:"error",message,line:token.line,column:token.column};}}
export function parse(tokens){
 let current=0;const peek=(n=0)=>tokens[Math.min(current+n,tokens.length-1)],at=v=>lower(peek().value)===lower(v),take=()=>tokens[current++],match=v=>at(v)?(take(),true):false;
 const expect=v=>{if(!match(v))throw new ParseError(peek(),"Се очекува „"+v+"“, добиено „"+(peek().value||"крај на влез")+"“.");};
 const identifier=()=>{if(peek().type!=="identifier")throw new ParseError(peek(),"Се очекува име на идентификатор.");return take().value;};
 const primary=()=>{if(peek().type==="number")return {type:"literal",value:Number(take().value)};if(peek().type==="direction")return {type:"literal",value:take().value};if(peek().type==="identifier")return {type:"variable",name:take().value};if(match("(")){const e=expression();expect(")");return e;}throw new ParseError(peek(),"Се очекува број, насока, променлива или израз.");};
 const expression=()=>{let node=primary();while(["+","-","*"].includes(peek().value)){const operator=take().value;node={type:"binary",operator,left:node,right:primary()};}return node;};
 const condition=()=>{if(match("(")){const left=expression(),operator=peek().value;if(!["==","<>",">","<",">=","<="].includes(operator))throw new ParseError(peek(),"Недостасува оператор за споредба.");take();const right=expression();expect(")");return {type:"comparison",left,operator,right};}if(at("жетон")||at("ѕид"))return {type:"sensor",sensor:lower(take().value)};throw new ParseError(peek(),"Се очекува услов со загради, „жетон“ или „ѕид“.");};
 const block=()=>{expect("!");const body=[];while(!at("!")&&peek().type!=="eof")body.push(statement());expect("!");return body;};
 const statement=()=>{
  if(match("променлива")){const names=[identifier()];while(match(","))names.push(identifier());return {type:"declare",names};}
  for(const cmd of ["оди","земи","остави","свртиЛево","свртиДесно"])if(match(cmd))return {type:"command",command:cmd};
  if(match("телепорт")){expect("(");const x=expression();expect(",");const y=expression();expect(")");return {type:"teleport",x,y};}
  if(match("ако"))return {type:"if",condition:condition(),body:block()};
  if(match("повторувај")){if(match("до"))return {type:"repeatUntil",condition:condition(),body:block()};const count=expression();expect("пати");expect(":");return {type:"repeat",count,body:block()};}
  if(peek().type==="identifier"){const name=identifier();if(match("="))return {type:"assign",name,value:expression()};if(match("(")){const args=[];if(!at(")")){args.push(expression());while(match(","))args.push(expression());}expect(")");return {type:"call",name,args};}throw new ParseError(peek(),"Се очекува доделување или повик на процедура по „"+name+"“.");}
  throw new ParseError(peek(),"Непозната команда „"+peek().value+"“.");
 };
 const procedures=[];let main=null;
 while(peek().type!=="eof"){
  expect("процедура");let name=null;if(!at("("))name=identifier();expect("(");const params=[];
  if(!at(")")){do{const type=lower(take().value);if(!["број","насока"].includes(type))throw new ParseError(peek(),"Типот на параметар мора да биде „број“ или „насока“.");params.push({type,name:identifier()});}while(match(","));}
  expect(")");const prelude=[];while(!at("почеток")&&peek().type!=="eof")prelude.push(statement());expect("почеток");const body=prelude;while(!at("крај")&&peek().type!=="eof")body.push(statement());expect("крај");
  const proc={type:"procedure",name,params,body};if(name===null){if(main)throw new ParseError(peek(),"Главната процедура е декларирана повеќе од еднаш.");main=proc;}else procedures.push(proc);
 }
 if(!main)throw new ParseError(peek(),"Недостасува главна процедура: процедура () почеток ... крај.");
 const names=new Set();for(const p of procedures){if(names.has(p.name))throw new ParseError(tokens[0],"Процедурата „"+p.name+"“ е декларирана повеќе пати.");names.add(p.name);}
 return {type:"program",procedures,main};
}