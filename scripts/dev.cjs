const fs=require('node:fs');
const path=require('node:path');
const build=require('./build.cjs');
const startServer=require('./serve.cjs');
const root=path.resolve(__dirname,'..');
build();
const server=startServer({live:true});
let timer;
for(const directory of ['src','vendor'])fs.watch(path.join(root,directory),{recursive:true},()=>{
 clearTimeout(timer);timer=setTimeout(()=>{try{build();server.reload()}catch(error){console.error('Build failed:',error.message)}},120);
});
