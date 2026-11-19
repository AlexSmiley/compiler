const commandCode={"оди":"go","земи":"tk","остави":"lv","свртиЛево":"rl","свртиДесно":"rr"};
const expr=n=>n.type==="literal"?String(n.value):n.type==="variable"?n.name:expr(n.left)+" "+n.operator+" "+expr(n.right);
export function generateRimal(program){
 const lines=[];
 const emit=p=>{lines.push(p.name?p.name+":":"main:");for(const param of p.params)if(param.type==="број")lines.push("data "+param.name);for(const s of p.body)statement(s,lines);lines.push("ret");};
 for(const p of program.procedures)emit(p);emit(program.main);return lines.join("\n");
}
function statement(s,out){
 switch(s.type){
  case "declare":s.names.forEach(n=>out.push("data "+n));break;
  case "command":out.push(commandCode[s.command]);break;
  case "assign":out.push(s.value.type==="binary"?"; expression "+s.name+" = "+expr(s.value):"move "+s.name+" "+expr(s.value));break;
  case "teleport":out.push("tlp ("+expr(s.x)+","+expr(s.y)+")");break;
  case "call":out.push("call "+s.name+"("+s.args.map(expr).join(",")+")");break;
  case "if":out.push("; if "+(s.condition.sensor||expr(s.condition.left)+" "+s.condition.operator+" "+expr(s.condition.right)),"jne next");s.body.forEach(x=>statement(x,out));out.push("next:");break;
  case "repeat":out.push("move regN, 0","loop:");s.body.forEach(x=>statement(x,out));out.push("; repeat "+expr(s.count)+" times","jne loop");break;
  case "repeatUntil":out.push("until:");s.body.forEach(x=>statement(x,out));out.push("; repeat until condition","jne until");break;
 }
}