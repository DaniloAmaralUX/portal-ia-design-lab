const fs=require('node:fs');
const path=require('node:path');
const JSON5=require('json5');
const root=path.resolve(__dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');

module.exports=function prepareData(){
 const source=read('vendor/tweakcn/utils/theme-presets.ts');
 const presets=JSON5.parse(source.slice(source.indexOf('=')+1).trim().replace(/;$/,''));
 const icons={};
 for(const file of fs.readdirSync(path.join(root,'vendor/lucide/icons')).sort()){
  const svg=read('vendor/lucide/icons/'+file);
  if(/<script|\bon\w+\s*=|(?:href|src)\s*=/i.test(svg))throw Error('Unexpected SVG content: '+file);
  icons[file.replace('.svg','')]=svg;
 }
 const licenses={tweakcn:read('vendor/tweakcn/LICENSE'),tailark:read('vendor/tailark/LICENCE.md'),lucide:read('vendor/lucide/LICENSE')};
 const revisions=JSON.parse(read('vendor/revisions.json'));
 const uiIcons={};
 for(const name of ['temas','blocos','icones'])uiIcons[name]='data:image/svg+xml;base64,'+fs.readFileSync(path.join(root,'src/assets/icons',name+'.svg')).toString('base64');
 const notices='Portal IA Design Lab — adaptações locais em português\n\n'+Object.entries(revisions).map(([name,value])=>name+'\nhttps://github.com/'+value.repo+'\nRevisão: '+value.sha+'\nModificações: interface em português; integração ao desktop; implementação local em HTML/CSS/JS.\n\n'+licenses[name]).join('\n\n------------------------------\n\n')+'\n\n------------------------------\n\nReact Bits / Strands\n'+read('vendor/react-bits/source.txt')+'\n\n'+read('vendor/react-bits/LICENSE.md')+'\n\n------------------------------\n\nMicrosoft Fluent System Icons\nhttps://github.com/microsoft/fluentui-system-icons\nSVGs usados na interface: Code Block, Puzzle Piece, Library, Apps.\n\n'+read('vendor/fluent/LICENSE')+'\n\nPaleta e folha de formas: desenhos SVG originais criados para esta interface.\n\nAs licenças e a procedência das skills acompanham seus arquivos ZIP.\n';
 return {data:{presets,icons,licenses,revisions,uiIcons},notices:notices+'\n\nGlass Icons / React Bits\n'+read('vendor/react-bits/glass-icons/source.txt')+'\nUses the React Bits license above; rendering lifecycle adapted to existing DOM controls.\n'};
};
