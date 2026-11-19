const commandCode={"оди":"go","земи":"tk","остави":"lv","свртиЛево":"rl","свртиДесно":"rr"};
const expr=n=>n.type==="literal"?String(n.value):n.type==="variable"?n.name:expr(n.left)+" "+n.operator+" "+expr(n.right);
export function generateRimal(program){
 const lines=[],context={label:0};
 const emit=p=>{lines.push(p.name?p.name+":":"main:");for(const param of p.params)if(param.type==="број")lines.push("data "+param.name);for(const s of p.body)statement(s,lines,context);lines.push("ret");};
 for(const p of program.procedures)emit(p);emit(program.main);return lines.join("\n");
}
function emitCondition(c,out,target){
 if(c.type==="sensor"){out.push("cmp regC "+(c.sensor==="жетон"?"$C":"$W"),"jne "+target);return;}
 out.push("cmp "+expr(c.left)+" "+expr(c.right));
 if(c.operator==="==")out.push("jne "+target);
 else if(c.operator==="<>")out.push("je "+target);
 else out.push("; comparison operator "+c.operator+" requires runtime-specific branch support");
}
function statement(s,out,ctx){
 switch(s.type){
  case "declare":s.names.forEach(n=>out.push("data "+n));break;
  case "command":out.push(commandCode[s.command]);break;
  case "assign":if(s.value.type==="binary")out.push("push","move regN "+expr(s.value.left),({"+":"add","-":"sub","*":"mul"})[s.value.operator]+" regN "+expr(s.value.right),"move "+s.name+" regN","pop");else out.push("move "+s.name+" "+expr(s.value));break;
  case "teleport":out.push("tlp ("+expr(s.x)+","+expr(s.y)+")");break;
  case "call":out.push("call "+s.name+"("+s.args.map(expr).join(",")+")");break;
  case "if":{const end="if_end_"+(ctx.label++);emitCondition(s.condition,out,end);s.body.forEach(x=>statement(x,out,ctx));out.push(end+":");break;}
  case "repeat":{const label="repeat_"+(ctx.label++);out.push("push","move regN 0",label+":");s.body.forEach(x=>statement(x,out,ctx));out.push("add regN 1","cmp regN "+expr(s.count),"jne "+label,"pop");break;}
  case "repeatUntil":{const label="until_"+(ctx.label++);out.push(label+":");s.body.forEach(x=>statement(x,out,ctx));emitCondition(s.condition,out,label);break;}
 }
}