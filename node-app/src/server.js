import http from "node:http";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {compile,run} from "./compiler.js";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../public");
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
const send=(res,status,data)=>{res.writeHead(status,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"});res.end(JSON.stringify(data));};
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,"http://localhost");
 if(req.method==="GET"&&url.pathname==="/api/health")return send(res,200,{status:"ok",name:"RoboL Node.js Compiler"});
 if(req.method==="POST"&&["/api/compile","/api/run"].includes(url.pathname)){
  let body="";req.on("data",chunk=>{body+=chunk;if(body.length>1000000)req.destroy();});
  req.on("end",()=>{try{const input=JSON.parse(body||"{}");if(typeof input.source!=="string")return send(res,400,{error:"Полето source мора да биде текст."});send(res,200,url.pathname==="/api/run"?run(input.source,String(input.environment||"")):compile(input.source));}catch(e){send(res,400,{error:e.message});}});return;
 }
 if(req.method!=="GET"&&req.method!=="HEAD")return send(res,405,{error:"Method not allowed"});
 const requested=decodeURIComponent(url.pathname==="/"?"/index.html":url.pathname),file=path.resolve(root,"."+requested);
 if(!file.startsWith(root+path.sep))return send(res,403,{error:"Forbidden"});
 try{const content=await readFile(file);res.writeHead(200,{"content-type":mime[path.extname(file)]||"application/octet-stream"});res.end(req.method==="HEAD"?undefined:content);}catch{send(res,404,{error:"Not found"});}
});
const port=Number(process.env.PORT||3000);server.listen(port,()=>console.log("RoboL web IDE listening on http://localhost:"+port));
