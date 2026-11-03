// Curated links are display data. Nothing in the linked skills is executed here.
const resourceData=JSON.parse(document.querySelector('#resources-data').textContent);
let resourceQuery='';
const resourceSymbols=name=>toolSymbol(name);
function resourceRoot(name){return name==='interfaces'?'skills':resourceData.folders[name]?.root||name}
function resourcePath(name){
 if(name==='interfaces')return 'skills › INTERFACES';
 const parts=[];let id=name;
 while(id){const folder=resourceData.folders[id];if(!folder)break;parts.unshift(folder.parent?folder.title:id);id=folder.parent}
 return parts.join(' › ');
}
function resourceEntries(name){return Object.entries(resourceData.folders).filter(([,folder])=>folder.parent===name)}
function resourceCount(name){return (name==='skills'?1:0)+resourceEntries(name).length+resourceData.items.filter(item=>item.folder===name).length}
function resourceCountLabel(count){return count+' '+(count===1?'item':'itens')}
function resourceElement(tag,className,text){const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element}
function resourceLink(url,label,className='resource-link'){
 const link=resourceElement('a',className,label);link.href=url;link.target='_blank';link.rel='noopener noreferrer';return link;
}
function openCatalogSkill(id){
 navigate('interfaces');category='todas';document.querySelectorAll('.library-filter').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category==='todas')));
 libraryQuery=id;document.querySelector('#window-search').value=id;filterLibrary();
 const row=[...document.querySelectorAll('.skill-row')].find(element=>element.dataset.skill===id),button=row?.querySelector('.skill-open');
 if(button){if(button.getAttribute('aria-expanded')!=='true')toggleSkillDetails(button,row.querySelector('.skill-details'));button.focus({preventScroll:true})}
}
function renderResourceFolder(){
 const folder=resourceData.folders[current],grid=document.querySelector('.folder-files');
 document.querySelector('#resource-title').textContent=folder?.title||current;
 document.querySelector('#resource-description').textContent=folder?.description||'';
 resourceQuery='';grid.querySelectorAll('.resource-entry').forEach(element=>element.remove());
 const interfaceFile=grid.querySelector('.interface-file');interfaceFile.hidden=current!=='skills';
 for(const [id,child] of resourceEntries(current)){
  const button=resourceElement('button','resource-entry resource-folder');button.type='button';button.dataset.resourceFolder=id;button.dataset.search=child.title+' '+child.description;button.setAttribute('aria-label','Abrir pasta '+child.title);
  const icon=resourceElement('span','resource-folder-icon');icon.setAttribute('aria-hidden','true');icon.innerHTML=resourceSymbols(child.symbol||'folder');
  const text=resourceElement('span','resource-folder-text');text.append(resourceElement('strong','',child.title),resourceElement('span','',resourceCountLabel(resourceCount(id))));
  const arrow=resourceElement('span','resource-folder-arrow');arrow.setAttribute('aria-hidden','true');arrow.innerHTML=resourceSymbols('chevron-right');
  button.append(icon,text,arrow);button.addEventListener('click',()=>navigate(id));grid.append(button);
 }
 for(const item of resourceData.items.filter(entry=>entry.folder===current)){
  const card=resourceElement('article','resource-entry resource-card');card.dataset.resource=item.id;card.dataset.search=[item.title,item.author,item.type,item.description].join(' ');
  const heading=resourceElement('div','resource-card-heading'),icon=resourceElement('span','resource-card-icon');icon.setAttribute('aria-hidden','true');icon.innerHTML=resourceSymbols(item.symbol);
  const titleBlock=resourceElement('div','resource-card-title');titleBlock.append(resourceElement('span','resource-type',item.type),resourceElement('h3','',item.title),resourceElement('p','resource-author',item.author));heading.append(icon,titleBlock);
  card.append(heading,resourceElement('p','resource-description',item.description));
  if(item.note)card.append(resourceElement('p','resource-note',item.note));
  if(item.command)card.append(resourceElement('code','resource-command',item.command));
  const actions=resourceElement('div','resource-actions');actions.append(resourceLink(item.url,item.actionLabel,'resource-open'));
  if(item.internalSkill){const button=resourceElement('button','resource-local','Ver SKILL.md');button.type='button';button.setAttribute('aria-label','Ver '+item.title+' na coleção Interfaces');button.addEventListener('click',()=>openCatalogSkill(item.internalSkill));actions.append(button)}
  const copy=resourceElement('button','resource-copy',item.commandLabel||'Copiar link');copy.type='button';copy.setAttribute('aria-label',(item.commandLabel||'Copiar link')+' de '+item.title);copy.addEventListener('click',()=>copyText(item.command||item.url,copy,item.commandLabel||'Copiar link',item.command?'command':'link'));actions.append(copy);card.append(actions);
  const source=resourceElement('div','resource-sources');source.append(resourceLink(item.url,new URL(item.url).hostname.replace(/^www\./,'')));
  if(item.guideUrl)source.append(resourceLink(item.guideUrl,item.guideLabel));card.append(source);grid.append(card);
 }
 filterResourceFolder('');
}
function filterResourceFolder(query){
 resourceQuery=query;const normalized=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),needle=normalized(query.trim());
 const grid=document.querySelector('.folder-files');let visible=0;
 const file=grid.querySelector('.interface-file');file.hidden=current!=='skills'||!normalized('interfaces Jakub Krehel coleção 16 skills').includes(needle);if(!file.hidden)visible++;
 for(const entry of grid.querySelectorAll('.resource-entry')){entry.hidden=!normalized(entry.dataset.search).includes(needle);if(!entry.hidden)visible++}
 const empty=document.querySelector('.resource-empty');empty.hidden=visible>0;empty.querySelector('p').textContent=query?'Nenhum resultado para “'+query+'”.':'Esta pasta ainda não tem itens.';empty.querySelector('button').hidden=!query;
 document.querySelector('#resource-count').textContent=resourceCountLabel(visible);document.querySelector('.finder-status .count').textContent=resourceCountLabel(visible);
}
document.querySelector('#clear-resource-search').addEventListener('click',()=>{document.querySelector('#window-search').value='';filterResourceFolder('');document.querySelector('#window-search').focus()});

document.querySelector('#library-manual-close').addEventListener('click',()=>{document.querySelector('.manual-copy').hidden=true;if(manualCopyTrigger?.isConnected)manualCopyTrigger.focus({preventScroll:true})});
