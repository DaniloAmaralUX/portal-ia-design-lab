const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
fs.mkdirSync(path.join(root,'tests/.artifacts'),{recursive:true});
let copied='',denyClipboard=false,downloads=[],errors=[],urlIndex=0,urls=new Map();
const virtualConsole=new VirtualConsole();virtualConsole.on('jsdomError',error=>{if(error.type==='unhandled-exception')errors.push(error.cause||error)});
function makeDOM(saved){return new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://mesa.test/',virtualConsole,beforeParse(w){
 w.matchMedia=query=>({matches:query.includes('pointer:fine'),addEventListener(){},removeEventListener(){}});
 w.HTMLDialogElement.prototype.show=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
 Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async text=>{if(denyClipboard)throw Error('denied');copied=text}}});
 w.document.execCommand=()=>false;w.Blob=Blob;w.URL.createObjectURL=blob=>{const url='blob:test/'+urlIndex++;urls.set(url,blob);return url};w.URL.revokeObjectURL=url=>urls.delete(url);
 w.HTMLAnchorElement.prototype.click=function(){if(this.download)downloads.push({name:this.download,blob:urls.get(this.href)})};
 if(saved)w.localStorage.setItem('mesa-theme-v1',saved);
}})}
const dom=makeDOM(),w=dom.window,d=w.document;
const $=selector=>{const result=d.querySelector(selector);assert.ok(result,selector);return result};
const click=selector=>$(selector).click();
const input=(selector,value,eventType='input')=>{const node=$(selector);node.value=value;node.dispatchEvent(new w.Event(eventType,{bubbles:true}))};
const key=(selector,value,extra={})=>$(selector).dispatchEvent(new w.KeyboardEvent('keydown',{key:value,bubbles:true,cancelable:true,...extra}));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let checks=0;
async function test(label,run){await run();assert.deepEqual(errors,[]);checks++;console.log('PASS '+label)}
(async()=>{try{
 await test('three localized launchers open their own tool panels',()=>{
  for(const id of ['temas','blocos','icones']){click(`[data-tool=${id}]`);assert.equal($('#tool-window').open,true);assert.equal($('#tool-'+id).hidden,false);assert.equal($(`[data-tool=${id}]`).getAttribute('aria-expanded'),'true');assert.equal(d.querySelectorAll('.tool-panel:not([hidden])').length,1)}
 });
 await test('42 original presets are selectable, retaining light and dark values',()=>{
  click('[data-tool=temas]');const original=JSON.parse($('#tools-data').textContent).presets;assert.equal($('#theme-preset').options.length,42);
  for(const [id,preset] of Object.entries(original)){input('#theme-preset',id,'change');assert.equal($('#color-value-primary').value,preset.styles.light.primary);click('[data-appearance=dark]');assert.equal($('#color-value-primary').value,preset.styles.dark.primary);click('[data-appearance=light]')}
  input('#theme-preset','modern-minimal','change');
 });
 await test('color changes update preview variables and exported CSS',()=>{
  input('#color-value-primary','#123456','change');assert.equal($('#theme-canvas').style.getPropertyValue('--p-primary'),'#123456');assert.ok($('#theme-output').value.includes('--primary: #123456;'));
 });
 await test('invalid colors do not contaminate the theme',()=>{
  input('#color-value-primary','red; } body {color:black','change');assert.equal($('#color-value-primary').getAttribute('aria-invalid'),'true');assert.equal($('#theme-canvas').style.getPropertyValue('--p-primary'),'#123456');assert.ok($('#theme-validation').textContent);input('#color-value-primary','#123456','change');
 });
 await test('undo and redo restore edited theme values',()=>{
  input('#color-value-primary','#654321','change');click('#theme-undo');assert.equal($('#color-value-primary').value,'#123456');click('#theme-redo');assert.equal($('#color-value-primary').value,'#654321');
 });
 await test('light and dark modes retain independent edits',()=>{
  click('[data-appearance=dark]');input('#color-value-primary','#abcdef','change');click('[data-appearance=light]');assert.equal($('#color-value-primary').value,'#654321');click('[data-appearance=dark]');assert.equal($('#color-value-primary').value,'#abcdef');
 });
 await test('radius, shadow, tracking, and fonts affect preview and export',()=>{
  for(const [id,value,key,expected] of [['radius','18','radius','18px'],['shadow','12','shadow-blur','12px'],['tracking','0.025','letter-spacing','0.025em']]){input('#theme-'+id,value);input('#theme-'+id,value,'change');assert.equal($('#theme-canvas').style.getPropertyValue('--p-'+key),expected);assert.ok($('#theme-output').value.includes('--'+key+': '+expected+';'))}
  input('#theme-font','Georgia, "Times New Roman", serif','change');assert.ok($('#theme-canvas').style.getPropertyValue('--p-font-sans').includes('Georgia'));
 });
 let saved;
 await test('saved themes survive document reload',()=>{
  click('#theme-save');saved=w.localStorage.getItem('mesa-theme-v1');assert.ok(saved);const fresh=makeDOM(saved);assert.equal(fresh.window.document.querySelector('#color-value-primary').value,'#abcdef');assert.equal(fresh.window.document.querySelector('#theme-radius').value,'18');fresh.window.close();
 });
 await test('saved theme injection is rejected',()=>{
  const unsafe=JSON.parse(saved);unsafe.light.primary='red; } body {display:none';const fresh=makeDOM(JSON.stringify(unsafe));assert.equal(fresh.window.document.querySelector('#color-value-primary').value,'#3b82f6');fresh.window.close();
 });
 await test('CSS copy and download include both modes and original license',async()=>{
  click('#theme-copy');await sleep(0);assert.ok(copied.includes(':root {'));assert.ok(copied.includes('.dark {'));assert.ok(copied.includes('@theme inline'));assert.ok(copied.includes('Apache License'));assert.ok(copied.includes('--primary: #abcdef;'));fs.writeFileSync(path.join(root,'tests/.artifacts/exported-theme.css'),copied);
  click('#theme-download');assert.ok(downloads.at(-1).name.endsWith('.css'));assert.equal(await downloads.at(-1).blob.text(),$('#theme-output').value);
 });
 await test('theme reset restores original preset and preview button adds a task',()=>{
  click('#theme-reset');assert.equal($('#color-value-primary').value,'#3b82f6');assert.equal($('#theme-radius').value,'6');click('#sample-add-task');assert.equal($('#sample-task-list').children.length,3);assert.equal($('#sample-task-count').textContent,'3 tarefas');
 });
 await test('all three Tailark compositions render standalone Portuguese HTML',()=>{
  click('[data-tool=blocos]');for(const kind of ['center','editorial','family']){input('#block-template',kind,'change');const src=$('#block-preview').srcdoc;assert.ok(src.includes('lang="pt-BR"'));assert.ok(src.includes('MIT License'));assert.ok(src.includes('<style>'));assert.ok(src.includes(kind==='family'?'profile-card':'app-window'));assert.ok(!/<script|<img|<iframe/i.test(src))}
 });
 await test('block edits are escaped and unsafe destinations disable export',()=>{
  input('#block-title','Olá <script>alert(1)</script>');const src=$('#block-preview').srcdoc;assert.ok(src.includes('&lt;script&gt;'));assert.ok(!src.includes('<script>'));input('#block-url','javascript:alert(1)');assert.equal($('#block-copy').disabled,true);assert.ok($('#block-validation').textContent);input('#block-url','https://example.com/contato?x=1&y=2');assert.equal($('#block-copy').disabled,false);
 });
 await test('block mobile toggle, copy, and download reflect edited content',async()=>{
  input('#block-title','Uma interface em português');click('[data-block-width=mobile]');assert.equal($('.block-preview-stage').dataset.width,'mobile');click('#block-copy');await sleep(0);assert.ok(copied.includes('Uma interface em português'));assert.ok(copied.includes('https://example.com/contato?x=1&amp;y=2'));click('#block-download');assert.equal(downloads.at(-1).name,'bloco-family.html');assert.equal(await downloads.at(-1).blob.text(),$('#block-preview').srcdoc);fs.writeFileSync(path.join(root,'tests/.artifacts/exported-block.html'),await downloads.at(-1).blob.text());click('#block-reset');assert.equal($('#block-title').value,'O dinheiro da família, finalmente organizado.');
 });
 await test('90 SVGs are searchable in Portuguese with accent normalization',()=>{
  click('[data-tool=icones]');assert.equal(d.querySelectorAll('.icon-tile').length,90);input('#icon-search','coracao');assert.equal(d.querySelectorAll('.icon-tile:not([hidden])').length,1);assert.equal($('.icon-tile:not([hidden])').dataset.icon,'heart');input('#icon-search','xyzzynaoexiste');assert.equal($('#icon-empty').hidden,false);input('#icon-search','');assert.equal(d.querySelectorAll('.icon-tile:not([hidden])').length,90);
 });
 await test('selected icon exports exact color, size, stroke, and valid XML',()=>{
  click('[data-icon=heart]');input('#icon-color','#876543');input('#icon-size','64');input('#icon-stroke','3.25');const xml=new w.DOMParser().parseFromString($('#icon-output').value,'image/svg+xml');assert.equal(xml.querySelector('parsererror'),null);assert.equal(xml.documentElement.getAttribute('width'),'64');assert.equal(xml.documentElement.getAttribute('height'),'64');assert.equal(xml.documentElement.getAttribute('stroke'),'#876543');assert.equal(xml.documentElement.getAttribute('stroke-width'),'3.25');assert.ok(xml.querySelector('path'));
 });
 await test('SVG copy and download preserve license and customization',async()=>{
  click('#icon-copy');await sleep(0);assert.ok(copied.includes('ISC License'));assert.ok(copied.includes('stroke="#876543"'));click('#icon-download');assert.equal(downloads.at(-1).name,'heart.svg');assert.equal(await downloads.at(-1).blob.text(),copied);
 });
 await test('copy denial offers selected manual text without reporting success',async()=>{
  denyClipboard=true;click('#icon-copy');await sleep(0);assert.equal($('.tool-manual-copy').hidden,false);assert.ok($('.tool-manual-copy textarea').value.includes('stroke="#876543"'));assert.equal(d.activeElement,$('.tool-manual-copy textarea'));key('.tool-manual-copy textarea','Escape');assert.equal($('.tool-manual-copy').hidden,true);assert.equal($('#tool-window').open,true);denyClipboard=false;
 });
 await test('minimize restores selected tool and unsaved customization',async()=>{
  d.dispatchEvent(new w.MouseEvent('pointerdown',{bubbles:true}));click('#tool-minimize');await sleep(140);assert.equal($('#tool-window').open,false);assert.equal($('[data-tool=icones]').dataset.running,'true');click('[data-tool=icones]');assert.equal($('#tool-icones').hidden,false);assert.equal($('#icon-color').value,'#876543');assert.equal($('#icon-size').value,'64');
 });
 await test('tool close/reopen is interruptible and maximize restores',async()=>{
  d.dispatchEvent(new w.MouseEvent('pointerdown',{bubbles:true}));click('#tool-close');click('[data-tool=temas]');await sleep(150);assert.equal($('#tool-window').open,true);assert.equal($('#tool-temas').hidden,false);click('#tool-maximize');assert.equal($('#tool-window').classList.contains('maximized'),true);click('#tool-maximize');assert.equal($('#tool-window').classList.contains('maximized'),false);
 });
 await test('Escape closes only the front window; dock keyboard focus works',()=>{
  $('.folder[data-folder=skills]').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert.equal($('#finder').open,true);click('[data-tool=icones]');key('#tool-window','Escape');assert.equal($('#tool-window').open,false);assert.equal($('#finder').open,true);key('#finder','Escape');assert.equal($('#finder').open,false);$('[data-tool=temas]').focus();key('[data-tool=temas]','ArrowRight');assert.equal(d.activeElement,$('[data-tool=blocos]'));
 });
 await test('closing Finder returns focus and keyboard control to the remaining tool',()=>{
  click('[data-tool=temas]');$('.folder[data-folder=skills]').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));
  assert.equal(d.body.dataset.frontWindow,'finder');click('#close-window');assert.equal($('#finder').open,false);assert.equal($('#tool-window').open,true);assert.equal(d.body.dataset.frontWindow,'tools');
  assert.ok($('#tool-window').contains(d.activeElement));key('#tool-window','Escape');assert.equal($('#tool-window').open,false);
 });
 await test('dock names are visible content and legacy desktop CSS is excluded',()=>{
  assert.deepEqual([...d.querySelectorAll('.tool-launch-name')].map(n=>n.textContent),['Temas','Blocos','Ícones']);
  const build=fs.readFileSync(path.join(root,'scripts/build.cjs'),'utf8');assert.ok(!build.includes('Downloads'));assert.ok(!build.includes("'refine'"));
  const shell=fs.readFileSync(path.join(root,'src/styles/desktop-shell.css'),'utf8');assert.ok(shell.includes('z-index: 0'));assert.ok(shell.includes('height: var(--work-height) !important'));assert.ok(shell.includes('.tool-launch-name'));
 });
 await test('six glass launchers retain semantic symbols, labels, and a GPU-free fallback',()=>{
  const tiles=[...d.querySelectorAll('.glass-tile')];assert.equal(tiles.length,6);
  assert.deepEqual(tiles.map(tile=>tile.dataset.glassSymbol),['terminal','plug','layers','palette','panels-top-left','shapes']);
  tiles.forEach(tile=>{assert.ok(tile.closest('button').getAttribute('aria-label'));assert.ok(tile.querySelector('.glass-icon-glyph svg'));assert.ok(tile.querySelector('.glass-icon-plate'));assert.ok(tile.querySelector('.glass-icon-glass'))});
  const original=fs.readFileSync(path.join(root,'vendor/react-bits/glass-icons/GlassIcons.original.jsx'),'utf8'),port=fs.readFileSync(path.join(root,'src/scripts/glass-icons.js'),'utf8');
  for(const name of ['VERTEX','FRAGMENT']){const regexp=new RegExp('const '+name+' = `([\\s\\S]*?)`;');assert.equal(original.match(regexp)[1].replace(/\r\n/g,'\n'),port.match(regexp)[1].replace(/\r\n/g,'\n'))}
 });
 await test('Aero Shards preserves original WGSL and leaves photo and clicks available without WebGPU',()=>{
  const original=fs.readFileSync(path.join(root,'vendor/react-bits/aero-shards/AeroShards.original.jsx'),'utf8').replace(/\r\n/g,'\n'),port=fs.readFileSync(path.join(root,'src/scripts/aero-shards.js'),'utf8').replace(/\r\n/g,'\n');
  const shaders=[...original.matchAll(/const ([A-Z_]+_SHADER) = `([\s\S]*?)`;/g)];assert.equal(shaders.length,9);
  for(const [,name,shader] of shaders){const match=port.match(new RegExp('const '+name+' = `([\\s\\S]*?)`;'));assert.ok(match,name);assert.equal(match[1],shader,name)}
  const layer=$('#aero-shards-overlay');assert.equal(layer.dataset.aeroState,'unsupported');assert.equal(layer.querySelector('canvas'),null);
  assert.equal(w.getComputedStyle(layer).pointerEvents,'none');assert.equal(w.getComputedStyle(layer).opacity,'0.25');assert.equal(layer.closest('.wallpaper').getAttribute('aria-hidden'),'true');
 });
 await test('wallpaper embeds the supplied photograph and archived Strands shaders remain intact',()=>{
  const original=fs.readFileSync(path.join(root,'vendor/react-bits/Strands.original.jsx'),'utf8'),port=fs.readFileSync(path.join(root,'src/scripts/strands.js'),'utf8');
  for(const name of ['VERT','FRAG']){const regexp=new RegExp('const '+name+' = `([\\s\\S]*?)`;');const a=original.match(regexp)[1],b=port.match(regexp)[1];assert.equal(crypto.createHash('sha256').update(a).digest('hex'),crypto.createHash('sha256').update(b).digest('hex'))}
  const photo=$('.desktop-wallpaper');assert.equal(photo.alt,'');assert.equal(photo.getAttribute('fetchpriority'),'high');
  assert.deepEqual(Buffer.from(photo.src.split(',')[1],'base64'),fs.readFileSync(path.join(root,'src/assets/backgrounds/elliott-engelmann-DjlKxYFJlTc-unsplash.jpg')));
  assert.equal(d.querySelector('#desktop-strands'),null);
 });
 console.log(`\n${checks} tool/background integration scenarios passed. DOM and generated files tested; WebGL pixels and browser platform APIs are not exercised by jsdom.`);
}finally{w.close()}})().catch(error=>{console.error(error);process.exitCode=1});
