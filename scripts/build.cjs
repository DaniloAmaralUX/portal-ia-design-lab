const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const prepareData=require('./prepare-data.cjs');
const root=path.resolve(__dirname,'..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8').replace(/\r\n/g,'\n');
const jsonForHTML=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e');

function build(){
 const {data:tools,notices}=prepareData();
 const interfaces=JSON.parse(read('src/data/interfaces.json'));
 const resources=JSON.parse(read('src/data/resources.json'));
 for(const [id,folder] of Object.entries(resources.folders)){
  assert.ok(resources.folders[folder.root],'Unknown root for '+id);
  const seen=new Set([id]);let parent=folder.parent;
  while(parent){assert.ok(resources.folders[parent],'Unknown parent for '+id);assert.ok(!seen.has(parent),'Folder cycle: '+id);seen.add(parent);parent=resources.folders[parent].parent}
 }
 const resourceIds=new Set();
 for(const item of resources.items){assert.ok(!resourceIds.has(item.id),'Duplicate resource: '+item.id);resourceIds.add(item.id);assert.ok(resources.folders[item.folder]);for(const url of [item.url,item.guideUrl].filter(Boolean))assert.equal(new URL(url).protocol,'https:');if(item.internalSkill)assert.ok(interfaces.skills.some(skill=>skill.id===item.internalSkill))}
 const desktopIcons={};
 for(const name of ['skills','plugins','recursos'])desktopIcons[name]='data:image/svg+xml;base64,'+fs.readFileSync(path.join(root,'src/assets/icons',name+'.svg')).toString('base64');
 const wallpaper='data:image/jpeg;base64,'+fs.readFileSync(path.join(root,'src/assets/backgrounds/elliott-engelmann-DjlKxYFJlTc-unsplash.jpg')).toString('base64');
 const styles=['base','library','tool-panels','resources','desktop-shell'].map(name=>read('src/styles/'+name+'.css')).join('\n');
 const scripts=['window-manager','desktop','interfaces','tools','resource-catalog'].map(name=>{
  const source=read('src/scripts/'+name+'.js');
  return name==='desktop'?source.replace('__DESKTOP_ICONS__',JSON.stringify(desktopIcons)):source;
 }).join('\n');
 const replacements={styles,scripts,wallpaper,resourcesData:jsonForHTML(resources),interfacesData:jsonForHTML(interfaces),toolsData:jsonForHTML(tools),libraryView:read('src/views/interfaces.html'),toolsView:read('src/views/tools.html'),iconSkills:desktopIcons.skills};
 const html=read('src/index.template.html').replace(/\{\{([A-Za-z]+)\}\}/g,(_,name)=>{
  assert.ok(Object.hasOwn(replacements,name),'Unknown template placeholder: '+name);
  return replacements[name];
 });
 assert.ok(!html.includes('__DESKTOP_ICONS__'));
 const dist=path.join(root,'dist');fs.mkdirSync(dist,{recursive:true});
 fs.writeFileSync(path.join(dist,'index.html'),html);
 fs.writeFileSync(path.join(dist,'interfaces-jakubkrehel.zip'),Buffer.from(interfaces.bundle,'base64'));
 fs.writeFileSync(path.join(dist,'LICENSES.txt'),notices);
 console.log(`Built dist/: ${Buffer.byteLength(html).toLocaleString('en-US')} bytes, ${interfaces.skills.length} skills, ${Object.keys(tools.presets).length} themes, ${Object.keys(tools.icons).length} icons.`);
 return dist;
}
module.exports=build;
if(require.main===module)build();
