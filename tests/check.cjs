const {JSDOM, VirtualConsole}=require('jsdom');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../dist/index.html'),'utf8');
let copied='',clipboardFails=false,fallbackWorks=false,fallbackCopied='',downloads=[],blobs=new Map();
const errors=[];
const virtualConsole=new VirtualConsole();
virtualConsole.on('jsdomError',error=>{if(error.type==='unhandled-exception')errors.push(error.cause||error)});
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://prototype.test/',virtualConsole,beforeParse(w){
 w.matchMedia=query=>({matches:query.includes('pointer:fine'),media:query,addEventListener(){},removeEventListener(){}});
 w.HTMLDialogElement.prototype.show=function(){this.setAttribute('open','')};
 w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')};
 Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async text=>{if(clipboardFails)throw Error('denied');copied=text}},configurable:true});
 w.document.execCommand=command=>{if(command==='copy'&&fallbackWorks){fallbackCopied=w.document.querySelector('body>textarea').value;return true}return false};
 w.Blob=Blob;
 w.URL.createObjectURL=blob=>{const id='blob:test-'+blobs.size;blobs.set(id,blob);return id};
 w.URL.revokeObjectURL=url=>blobs.delete(url);
 w.HTMLAnchorElement.prototype.click=function(){if(this.download)downloads.push({name:this.download,blob:blobs.get(this.href)})};
}});
const w=dom.window,d=w.document;
const $=selector=>{const node=d.querySelector(selector);assert.ok(node,selector);return node};
const click=selector=>$(selector).click();
const key=(selector,value,options={})=>$(selector).dispatchEvent(new w.KeyboardEvent('keydown',{key:value,bubbles:true,cancelable:true,...options}));
const pointer=()=>d.dispatchEvent(new w.MouseEvent('pointerdown',{bubbles:true,button:0}));
const dbl=selector=>{pointer();$(selector).dispatchEvent(new w.MouseEvent('dblclick',{bubbles:true,detail:2}))};
const search=text=>{$('#window-search').value=text;$('#window-search').dispatchEvent(new w.Event('input',{bubbles:true}))};
const visible=()=>[...d.querySelectorAll('.skill-row')].filter(row=>!row.hidden);
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let checks=0;
async function test(label,run){await run();assert.deepEqual(errors,[]);checks++;console.log('PASS '+label)}
(async()=>{try{
 const data=JSON.parse($('#interfaces-data').textContent);
 await test('desktop keeps three library icons and restores a three-tool dock',()=>{
  assert.deepEqual([...d.querySelectorAll('.folder')].map(x=>x.dataset.folder),['skills','plugins','recursos']);
  assert.equal(d.querySelector('.menu-bar'),null);assert.equal(d.querySelectorAll('.tool-dock .tool-launch').length,3);assert.equal($('#finder').open,false);
 });
 await test('single click selects; double click opens skills',()=>{
  pointer();$('.folder').dispatchEvent(new w.MouseEvent('click',{bubbles:true,detail:1}));assert.equal($('#finder').open,false);assert.ok($('.folder').classList.contains('selected'));
  dbl('.folder[data-folder=skills]');assert.equal($('#finder').open,true);assert.equal($('.folder-files').hidden,false);
 });
 await test('icon/list buttons change folder view',()=>{
  click('[data-view-button=list]');assert.equal($('.finder-content').dataset.view,'list');assert.equal($('[data-view-button=list]').getAttribute('aria-pressed'),'true');
  click('[data-view-button=grid]');assert.equal($('.finder-content').dataset.view,'grid');
 });
 await test('folder search returns real matches and empty results',()=>{
  search('missing');assert.equal($('.interface-file').hidden,true);assert.equal($('.finder-empty').hidden,false);
  search('INTERFACES');assert.equal($('.interface-file').hidden,false);search('');
 });
 await test('keyboard Enter opens INTERFACES with 16 original documents',()=>{
  key('.interface-file','Enter');assert.equal($('#folder-title').textContent,'INTERFACES');assert.equal($('.view-toggle').hidden,true);assert.equal(visible().length,16);
  assert.ok(data.skills.every(s=>$(`[data-skill="${s.id}"] .skill-markdown`).textContent===s.markdown));
 });
 await test('history back/forward restores folder and page',()=>{
  click('#back');assert.equal($('#folder-title').textContent,'skills');assert.equal($('.view-toggle').hidden,false);
  click('#forward');assert.equal($('#folder-title').textContent,'INTERFACES');
 });
 await test('all category filters and combined search work',()=>{
  for(const [category,count] of [['fundamentos',7],['fluxos',6],['extras',3],['todas',16]]){click(`[data-category=${category}]`);assert.equal(visible().length,count)}
  search('typography');assert.equal(visible().length,1);assert.equal(visible()[0].dataset.skill,'better-typography');
  search('no-such-skill');assert.equal(visible().length,0);assert.equal($('.library-empty').hidden,false);search('');
 });
 await test('details toggle immediately from keyboard',()=>{
  key('[data-skill=better-ui] .skill-open','Tab');click('[data-skill=better-ui] .skill-open');
  const details=$('#detail-better-ui');assert.equal(details.hidden,false);assert.equal(details.inert,false);assert.ok(details.classList.contains('detail-visible'));
  click('[data-skill=better-ui] .skill-open');assert.equal(details.hidden,true);assert.equal(details.inert,true);
 });
 await test('rapid details reopen cancels stale closing timer',async()=>{
  pointer();click('[data-skill=better-ui] .skill-open');await delay(25);click('[data-skill=better-ui] .skill-open');click('[data-skill=better-ui] .skill-open');await delay(160);
  assert.equal($('#detail-better-ui').hidden,false);assert.equal($('#detail-better-ui').inert,false);assert.equal($('[data-skill=better-ui] .skill-open').getAttribute('aria-expanded'),'true');
 });
 await test('each copy button copies its actual install command',async()=>{
  for(const skill of data.skills){click(`[data-skill="${skill.id}"] .skill-copy`);await delay(0);assert.equal(copied,skill.command)}
  assert.equal($('[data-skill=better-ui] .skill-copy').getAttribute('aria-label'),'Comando copiado');
 });
 await test('copy document and collection copies exact source data',async()=>{
  click('[data-skill=better-ui] .skill-copy-document');await delay(0);assert.equal(copied,data.skills.find(s=>s.id==='better-ui').markdown);
  click('#copy-collection');await delay(0);assert.equal(copied.split('\n').length,3);assert.ok(copied.includes("--skill '*'"));assert.ok(copied.includes('make-interfaces-feel-better'));assert.ok(copied.includes('oklch-skill'));
 });
 await test('clipboard permission denial uses copy fallback then manual selection',async()=>{
  clipboardFails=true;fallbackWorks=true;click('[data-skill=better-ui] .skill-copy');await delay(0);assert.equal(fallbackCopied,data.skills.find(s=>s.id==='better-ui').command);
  fallbackWorks=false;click('[data-skill=better-ui] .skill-copy-document');await delay(0);assert.equal($('.manual-copy').hidden,false);assert.equal($('.manual-copy textarea').value,data.skills.find(s=>s.id==='better-ui').markdown);assert.equal(d.activeElement,$('.manual-copy textarea'));clipboardFails=false;
 });
 await test('16 ZIP buttons plus collection produce exact embedded bytes',async()=>{
  for(const skill of data.skills)click(`[data-skill="${skill.id}"] .skill-download`);click('#download-collection');
  assert.equal(downloads.length,17);
  for(const item of downloads){const expected=item.name==='interfaces-jakubkrehel.zip'?data.bundle:data.skills.find(s=>s.id+'.zip'===item.name).download;const bytes=Buffer.from(await item.blob.arrayBuffer());assert.equal(bytes.readUInt32LE(0),0x04034b50);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),crypto.createHash('sha256').update(Buffer.from(expected,'base64')).digest('hex'))}
 });
 await test('minimize and restore preserves INTERFACES search and selection',async()=>{
  click('[data-category=fundamentos]');search('typography');pointer();click('#minimize-window');await delay(150);assert.equal($('#finder').open,false);assert.ok($('.folder[data-folder=skills]').classList.contains('running'));
  dbl('.folder[data-folder=skills]');assert.equal($('#finder').open,true);assert.equal($('#folder-title').textContent,'INTERFACES');assert.equal($('#window-search').value,'typography');assert.equal(visible().length,1);assert.ok(!$('.folder[data-folder=skills]').classList.contains('running'));
 });
 await test('maximize and restore work',()=>{
  click('#maximize-window');assert.ok($('#finder').classList.contains('maximized'));assert.equal($('#maximize-window').getAttribute('aria-label'),'Restaurar janela');
  click('#maximize-window');assert.ok(!$('#finder').classList.contains('maximized'));
 });
 await test('close and immediate reopen does not lose the new window',async()=>{
  pointer();click('#close-window');dbl('.folder[data-folder=plugins]');await delay(160);assert.equal($('#finder').open,true);assert.equal($('#folder-title').textContent,'plugins');assert.equal($('.finder-empty').hidden,false);
 });
 await test('all sidebar folders navigate and empty folders report 0 items',()=>{
  for(const name of ['recursos','plugins','skills']){click(`.sidebar-folder[data-folder=${name}]`);assert.equal($('#folder-title').textContent,name);assert.equal($('.finder-status .count').textContent,name==='skills'?'1 item':'0 itens')}
 });
 await test('Escape closes, Ctrl+K opens search, Ctrl+W closes',()=>{
  key('#finder','Escape');assert.equal($('#finder').open,false);key('body','k',{ctrlKey:true});assert.equal($('#finder').open,true);assert.equal(d.activeElement,$('#window-search'));key('#finder','w',{ctrlKey:true});assert.equal($('#finder').open,false);
 });
 await test('desktop arrow navigation and keyboard open work',()=>{
  $('.folder[data-folder=skills]').focus();key('.folder[data-folder=skills]','ArrowDown');assert.equal(d.activeElement,$('.folder[data-folder=plugins]'));key('.folder[data-folder=plugins]','Enter');assert.equal($('#folder-title').textContent,'plugins');assert.equal($('#finder').open,true);
 });
 console.log(`\n${checks} integration scenarios passed. Dialog, clipboard and download platform APIs were stubbed; layout is not rendered by jsdom.`);
}finally{dom.window.close()}})().catch(error=>{console.error(error);process.exitCode=1});
