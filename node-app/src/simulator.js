import {inside} from "./environment.js";
const DELTA={"И":[1,0],"З":[-1,0],"С":[0,-1],"Ј":[0,1]};
const LEFT={"И":"С","С":"З","З":"Ј","Ј":"И"},RIGHT={"И":"Ј","Ј":"З","З":"С","С":"И"};
export function simulate(program,environment,options={}){
 const world={...environment,walls:environment.walls.map(p=>[...p]),tokens:environment.tokens.map(p=>[...p]),robot:{...environment.robot}};
 const trace=[],diagnostics=[],variables=Object.create(null),procedures=new Map(program.procedures.map(p=>[p.name,p]));
 const wallSet=new Set(world.walls.map(p=>p.join(","))),tokenSet=new Set(world.tokens.map(p=>p.join(",")));
 let steps=0;const maxSteps=options.maxSteps||5000,key=(x,y)=>x+","+y;
 const evalExpr=n=>{if(n.type==="literal")return n.value;if(n.type==="variable"){if(!(n.name in variables))throw Error("Недекларирана променлива „"+n.name+"“.");return variables[n.name];}const a=Number(evalExpr(n.left)),b=Number(evalExpr(n.right));return n.operator==="+"?a+b:n.operator==="-"?a-b:a*b;};
 const condition=n=>{if(n.type==="sensor"){if(n.sensor==="жетон")return tokenSet.has(key(world.robot.x,world.robot.y));const d=DELTA[world.robot.direction],x=world.robot.x+d[0],y=world.robot.y+d[1];return !inside(world,x,y)||wallSet.has(key(x,y));}const a=evalExpr(n.left),b=evalExpr(n.right);return {"==":a===b,"<>":a!==b,">":a>b,"<":a<b,">=":a>=b,"<=":a<=b}[n.operator];};
 const log=action=>trace.push({step:trace.length+1,action,x:world.robot.x,y:world.robot.y,direction:world.robot.direction,tokens:tokenSet.size});
 const execute=(body,depth=0)=>{if(depth>30)throw Error("Премногу длабока рекурзија на процедури.");
  for(const s of body){if(++steps>maxSteps)throw Error("Достигнат е лимитот на извршување.");
   switch(s.type){
    case "declare":s.names.forEach(n=>variables[n]=0);break;
    case "assign":variables[s.name]=evalExpr(s.value);break;
    case "command":
     if(s.command==="свртиЛево")world.robot.direction=LEFT[world.robot.direction];
     else if(s.command==="свртиДесно")world.robot.direction=RIGHT[world.robot.direction];
     else if(s.command==="оди"){const d=DELTA[world.robot.direction],x=world.robot.x+d[0],y=world.robot.y+d[1];if(!inside(world,x,y)||wallSet.has(key(x,y)))throw Error("Роботот се обиде да помине низ ѕид или надвор од мапата.");world.robot.x=x;world.robot.y=y;}
     else if(s.command==="земи"){if(!tokenSet.delete(key(world.robot.x,world.robot.y)))throw Error("Нема жетон на позицијата на роботот.");}
     else if(s.command==="остави")tokenSet.add(key(world.robot.x,world.robot.y));
     log(s.command);break;
    case "teleport":{const x=Number(evalExpr(s.x)),y=Number(evalExpr(s.y));if(!inside(world,x,y)||wallSet.has(key(x,y)))throw Error("Телепортирање надвор од мапата или во ѕид не е дозволено.");world.robot.x=x;world.robot.y=y;log("телепорт");break;}
    case "if":if(condition(s.condition))execute(s.body,depth);break;
    case "repeat":{const count=Number(evalExpr(s.count));if(!Number.isInteger(count)||count<0||count>maxSteps)throw Error("Повторувањето бара валиден ненегативен број.");for(let i=0;i<count;i++)execute(s.body,depth);break;}
    case "repeatUntil":{let count=0;do{execute(s.body,depth);if(++count>maxSteps)throw Error("Повторувањето ја надмина дозволената граница.");}while(!condition(s.condition));break;}
    case "call":{const p=procedures.get(s.name);if(!p)throw Error("Непозната процедура „"+s.name+"“.");if(p.params.length!==s.args.length)throw Error("Погрешен број аргументи за „"+s.name+"“.");const saved={...variables},args=s.args.map(evalExpr);p.params.forEach((param,i)=>variables[param.name]=args[i]);execute(p.body,depth+1);Object.keys(variables).forEach(n=>{if(!(n in saved))delete variables[n];});Object.assign(variables,saved);break;}
   }
  }
 };
 try{execute(program.main.body);}catch(e){diagnostics.push({code:"RUN001",severity:"error",message:e.message});}
 world.tokens=[...tokenSet].map(v=>v.split(",").map(Number));return {world,trace,variables,diagnostics,completed:diagnostics.length===0};
}