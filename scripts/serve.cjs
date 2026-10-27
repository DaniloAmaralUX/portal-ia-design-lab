const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const dist=path.resolve(__dirname,'../dist');
const mime={'.html':'text/html; charset=utf-8','.txt':'text/plain; charset=utf-8','.zip':'application/zip','.svg':'image/svg+xml','.json':'application/json; charset=utf-8'};

function startServer({live=false}={}){
 const clients=new Set();
 const server=http.createServer((req,res)=>{
  let route;
  try{route=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
  if(live&&route==='/__reload'){
   res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write(': connected\n\n');clients.add(res);req.on('close',()=>clients.delete(res));return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return}
  if(route.endsWith('/'))route+='index.html';
  const target=path.resolve(dist,'.'+route);
  if(!target.startsWith(dist+path.sep)){res.writeHead(403).end();return}
  if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404).end('Não encontrado');return}
  let body=fs.readFileSync(target);
  if(live&&path.extname(target)==='.html'){
   const html=body.toString('utf8'),end=html.lastIndexOf('</body>');
   const reload='<script>new EventSource("/__reload").onmessage=()=>location.reload();</script>';
   if(end>=0)body=Buffer.from(html.slice(0,end)+reload+html.slice(end));
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:body);
 });
 server.reload=()=>{for(const client of clients)client.write('data: reload\n\n')};
 const port=Number(process.env.PORT)||3000;
 server.listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}`));
 server.on('error',error=>{console.error(error.message);process.exitCode=1});
 return server;
}
module.exports=startServer;
if(require.main===module)startServer();
