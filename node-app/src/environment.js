export const inside=(env,x,y)=>x>=1&&y>=1&&x<=env.width&&y<=env.height;
export function parseEnvironment(source){
 const diagnostics=[],text=source.replace(/^\uFEFF/,""),size=text.match(/околина\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/iu);
 if(!size)return {environment:null,diagnostics:[{code:"ENV001",severity:"error",message:"Недостасува дефиниција „околина (ширина, висина)“.",line:1,column:1}]};
 const width=Number(size[1]),height=Number(size[2]);if(width<1||height<1||width>60||height>60)diagnostics.push({code:"ENV002",severity:"error",message:"Димензиите мора да бидат меѓу 1 и 60.",line:1,column:1});
 const walls=[],ws=text.match(/ѕидови\s*почеток([\s\S]*?)крај/iu);if(ws){for(const m of ws[1].matchAll(/(ИЗ|СЈ)\s+(\d+)\s+(\d+)\s*-\s*(\d+)/giu)){const dir=m[1].toUpperCase(),a=Number(m[2]),b=Number(m[3]),end=Number(m[4]);for(let n=b;n<=end;n++)walls.push(dir==="СЈ"?[a,n]:[n,b]);}}else diagnostics.push({code:"ENV003",severity:"error",message:"Недостасува секцијата ѕидови.",line:1,column:1});
 const tokens=[],ts=text.match(/жетони\s*почеток([\s\S]*?)крај/iu);if(ts)for(const m of ts[1].matchAll(/\(\s*(\d+)\s*,\s*(\d+)\s*\)/gu))tokens.push([Number(m[1]),Number(m[2])]);else diagnostics.push({code:"ENV004",severity:"error",message:"Недостасува секцијата жетони.",line:1,column:1});
 const r=text.match(/робот\s+([ИЗСЈ])\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/iu);if(!r)diagnostics.push({code:"ENV005",severity:"error",message:"Недостасува позиција на роботот, на пример робот И (1,1).",line:1,column:1});
 const environment={width,height,walls,tokens,robot:r?{direction:r[1].toUpperCase(),x:Number(r[2]),y:Number(r[3])}:null};
 if(environment.robot&&!inside(environment,environment.robot.x,environment.robot.y))diagnostics.push({code:"ENV006",severity:"error",message:"Почетната позиција на роботот е надвор од мапата.",line:1,column:1});
 for(const [x,y] of tokens)if(!inside(environment,x,y))diagnostics.push({code:"ENV007",severity:"error",message:"Жетон на позиција ("+x+","+y+") е надвор од мапата.",line:1,column:1});
 return {environment:diagnostics.some(d=>d.severity==="error")?null:environment,diagnostics};
}