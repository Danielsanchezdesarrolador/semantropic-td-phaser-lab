import {createServer} from "node:http";
import {stat,readFile} from "node:fs/promises";
import {resolve,join,extname,sep} from "node:path";
import {spawn} from "node:child_process";
const base=resolve("dist"),mime={".mjs":"text/javascript",".js":"text/javascript",".html":"text/html",".png":"image/png",".svg":"image/svg+xml",".css":"text/css",".json":"application/json"};
const http=createServer(async(req,res)=>{
 try{
  const path=resolve(base,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
  if(!path.startsWith(base+sep)&&path!==base)throw Error("forbidden");
  const final=(await stat(path)).isDirectory()?join(path,"index.html"):path;
  res.writeHead(200,{"Content-Type":mime[extname(final)]||"application/octet-stream"});
  res.end(await readFile(final));
 }catch(e){res.writeHead(404);res.end(String(e))}
});
await new Promise(ok=>http.listen(0,"127.0.0.1",ok));
const url="http://127.0.0.1:"+http.address().port+"/official/src/actors-visual/p08/index.html";
const child=spawn(process.execPath,["public/official/src/actors-visual/p08/qa-p08-browser.mjs"],{
 stdio:"inherit",env:{...process.env,P08_REVIEW_URL:url}});
const exit=await new Promise(r=>child.on("exit",code=>r(code??1)));
await new Promise(r=>http.close(r));process.exitCode=exit;
