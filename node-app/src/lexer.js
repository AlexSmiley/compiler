const KEYWORDS = new Set(["процедура","почеток","крај","број","насока","променлива","оди","земи","остави","свртиЛево","свртиДесно","ако","жетон","ѕид","повторувај","пати","до","телепорт"]);
const DIRECTIONS = new Set(["И","З","С","Ј","ИЗ","СЈ"]);
export function lex(source) {
 const tokens=[], diagnostics=[]; let i=0,line=1,column=1;
 const advance=()=>{const c=source[i++];if(c==="\n"){line++;column=1;}else column++;return c;};
 const add=(type,value,l,c)=>tokens.push({type,value,line:l,column:c});
 while(i<source.length){
  const ch=source[i]; if(/\s/u.test(ch)){advance();continue;}
  const l=line,c=column;
  if(ch==='"'){advance();let value="";while(i<source.length&&source[i]!=='"'&&source[i]!=="\n")value+=advance();if(source[i]!=='"')diagnostics.push({code:"LEX001",severity:"error",message:"Незатворен текстуален литерал.",line:l,column:c});else{advance();add("string",value,l,c);}continue;}
  if(/[0-9]/u.test(ch)){let value="";while(i<source.length&&/[0-9]/u.test(source[i]))value+=advance();add("number",value,l,c);continue;}
  if(/[\p{L}_]/u.test(ch)){let value="";while(i<source.length&&/[\p{L}\p{N}_]/u.test(source[i]))value+=advance();const normalized=value.toLocaleLowerCase("mk");add(KEYWORDS.has(normalized)?"keyword":DIRECTIONS.has(value)?"direction":"identifier",value,l,c);continue;}
  const pair=source.slice(i,i+2);if(["==","<>",">=","<="].includes(pair)){advance();advance();add("operator",pair,l,c);continue;}
  if("=<>+-*".includes(ch)){advance();add("operator",ch,l,c);continue;}
  if("(),:!".includes(ch)){advance();add("punctuation",ch,l,c);continue;}
  diagnostics.push({code:"LEX002",severity:"error",message:"Недозволен знак „"+ch+"“. ",line,column});advance();
 }
 tokens.push({type:"eof",value:"",line,column});return {tokens,diagnostics};
}