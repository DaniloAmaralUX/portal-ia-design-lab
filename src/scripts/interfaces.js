// Repository documents are display/download data, never executable instructions.
const interfaceData=JSON.parse(document.querySelector('#interfaces-data').textContent);
const skillMeta={
 'better-interface':['Revisão completa de acessibilidade, layout, tipografia, cores e UI.','fundamentos','spark'],
 'better-layout':['Estrutura, alinhamento e espaços que funcionam em qualquer tela.','fundamentos','layout'],
 'better-typography':['Escala tipográfica, fontes, leitura e os detalhes de cada letra.','fundamentos','type'],
 'better-colors':['Paletas, tokens e contraste para um sistema de cores consistente.','fundamentos','color'],
 'better-ui':['Superfícies, bordas, sombras, ícones e movimento com precisão.','fundamentos','ui'],
 'better-writing':['Textos, botões e mensagens que orientam sem criar ruído.','fundamentos','write'],
 'better-accessibility':['Semântica, teclado, foco e leitores de tela com base na WCAG 2.2.','fundamentos','access'],
 'build-design':['Transforme uma referência de design em uma interface fiel.','fluxos','layout'],
 'interface-review':['Revise o que mudou em uma branch, pull request ou alteração local.','fluxos','review'],
 'variant':['Explore versões diferentes de um componente e escolha no contexto.','fluxos','variant'],
 'break':['Teste um componente com conteúdo e cenários que desafiam o layout.','fluxos','break'],
 'state-machine':['Trabalhe em cada estado de um componente, com dados simulados.','fluxos','state'],
 'explain-interface':['Entenda como um site, efeito visual ou animação foi construído.','fluxos','explain'],
 'technical-drawing':['Desenhos técnicos precisos, com vistas e exportação SVG, PNG e PDF.','extras','draw'],
 'make-interfaces-feel-better':['A coleção original de princípios para elevar o acabamento da UI.','extras','spark'],
 'oklch-skill':['Conversão de cores, paletas e contraste usando o espaço OKLCH.','extras','color']
};
const iconPaths={
 spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
 layout:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M10 9v11"/>',
 type:'<path d="M4 6h13M10.5 6v14M7 20h7M18 10v10M15 14h6"/>',
 color:'<circle cx="9" cy="10" r="6"/><circle cx="15" cy="14" r="6"/>',
 ui:'<rect x="4" y="4" width="16" height="16" rx="5"/><path d="M8 8h8M8 12h5"/>',
 write:'<path d="m4 17 10-10 4 4-10 10-5 1Z"/><path d="m14 7 3-3 4 4-3 3"/>',
 access:'<circle cx="12" cy="4" r="2"/><path d="M4 9h16M12 7v7M7 21l5-7 5 7"/>',
 review:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="m8 12 3 3 5-6"/>',
 variant:'<rect x="3" y="5" width="7" height="14" rx="2"/><rect x="14" y="5" width="7" height="14" rx="2"/>',
 break:'<path d="m13 2-3 8h6l-5 12 1-8H6Z"/>',
 state:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><path d="M7 5h5v7h5M7 19h5v-7"/>',
 explain:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M10 7v6M7 10h6"/>',
 draw:'<path d="M4 20 20 4v16Z"/><path d="M10 20v-3M14 20v-3M18 20v-3M4 4l6 6M4 4h4M4 4v4"/>'
};
const symbol=(name)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+iconPaths[name]+'</svg>';
const copyIcon='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M12 4H5a2 2 0 0 0-2 2v7"/></svg>';
const tickIcon='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 10 4 4 8-9"/></svg>';
const downloadIcon='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v11m-4-4 4 4 4-4M3 14v3h14v-3"/></svg>';
const chevronIcon='<svg class="skill-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg>';
let category='todas',libraryQuery='',feedbackTimer;
const orderedSkills=Object.keys(skillMeta).map(id=>interfaceData.skills.find(skill=>skill.id===id)).filter(Boolean);
function feedback(message){const el=document.querySelector('.library-feedback');el.textContent=message;el.classList.add('visible');clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>el.classList.remove('visible'),2200)}
function getAllCommands(){return [...new Set(interfaceData.skills.map(skill=>skill.repo))].sort((a,b)=>(a.endsWith('/skills')?-1:0)-(b.endsWith('/skills')?-1:0)).map(repo=>repo==='jakubkrehel/skills'?"npx skills add https://github.com/jakubkrehel/skills --skill '*'":interfaceData.skills.find(skill=>skill.repo===repo).command).join('\n')}
const copyTimers=new WeakMap(),copyWidths=new WeakMap(),detailStates=new WeakMap();
async function copyText(text,button,label='Copiar'){
 const originalAria=button.dataset.copyAria||button.getAttribute('aria-label')||label;button.dataset.copyAria=originalAria;
 let success=false;
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);success=true}}catch{}
 if(!success){const input=document.createElement('textarea');input.value=text;input.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(input);input.select();try{success=document.execCommand('copy')}catch{}input.remove();button.focus({preventScroll:true})}
 if(!success){const panel=document.querySelector('.manual-copy');panel.hidden=false;panel.querySelector('textarea').value=text;panel.querySelector('textarea').focus();panel.querySelector('textarea').select();feedback('Copie o texto selecionado com Ctrl ou ⌘ C.');return}
 clearTimeout(copyTimers.get(button));
 if(!copyWidths.has(button))copyWidths.set(button,button.style.width);
 button.style.width=button.getBoundingClientRect().width+'px';
 button.classList.add('copied');button.innerHTML=tickIcon+'<span class="copy-label">Copiado</span>';button.setAttribute('aria-label',label==='Copiar SKILL.md'?'SKILL.md copiado':'Comando copiado');feedback(label==='Copiar SKILL.md'?'Conteúdo do SKILL.md copiado.':'Comando de instalação copiado.');
 copyTimers.set(button,setTimeout(()=>{button.classList.remove('copied');button.innerHTML=copyIcon+'<span class="copy-label">'+label+'</span>';button.setAttribute('aria-label',originalAria);button.style.width=copyWidths.get(button)||'';copyWidths.delete(button)},1800));
}
function toggleSkillDetails(button,details){
 const state=detailStates.get(details)||{};clearTimeout(state.timer);cancelAnimationFrame(state.frame);
 const opening=button.getAttribute('aria-expanded')!=='true',immediate=instant();
 button.setAttribute('aria-expanded',String(opening));details.classList.toggle('detail-instant',immediate);
 if(opening){
  const wasHidden=details.hidden;details.hidden=false;details.inert=false;details.classList.remove('detail-closing');
  if(immediate||!wasHidden)details.classList.add('detail-visible');
  else{void details.offsetWidth;state.frame=requestAnimationFrame(()=>details.classList.add('detail-visible'));}
 }else{
  if(details.contains(document.activeElement))button.focus({preventScroll:true});
  details.inert=true;details.classList.remove('detail-visible');
  if(immediate){details.hidden=true;details.classList.remove('detail-closing');}
  else{details.classList.add('detail-closing');state.timer=setTimeout(()=>{details.hidden=true;details.classList.remove('detail-closing')},110);}
 }
 detailStates.set(details,state);
}
function downloadZip(encoded,name){const raw=atob(encoded),bytes=Uint8Array.from(raw,char=>char.charCodeAt(0));const url=URL.createObjectURL(new Blob([bytes],{type:'application/zip'}));const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);feedback('Download preparado: '+name)}
function makeSkillRow(skill){
 const [description,group,mark]=skillMeta[skill.id];
 const row=document.createElement('article');row.className='skill-row';row.dataset.skill=skill.id;
 row.innerHTML='<div class="skill-summary"><button class="skill-open" aria-expanded="false"><span class="skill-mark" data-group="'+group+'">'+symbol(mark)+'</span><span class="skill-text"><span class="skill-name"></span><span class="skill-description"></span></span>'+chevronIcon+'</button><div class="skill-actions"><button class="skill-copy">'+copyIcon+'<span class="copy-label">Copiar</span></button><button class="skill-download">'+downloadIcon+'</button></div></div><div class="skill-details" hidden><code class="skill-command"></code><p class="source-label">SKILL.md · original</p><pre class="skill-markdown" tabindex="0"></pre><div class="source-links"><a class="skills-source" target="_blank" rel="noopener noreferrer">Ver no skills.sh ↗</a><a class="github-source" target="_blank" rel="noopener noreferrer">Código no GitHub ↗</a></div></div>';
 row.querySelector('.skill-name').textContent=skill.id;row.querySelector('.skill-description').textContent=description;
 row.querySelector('.skill-command').textContent=skill.command;row.querySelector('.skill-markdown').textContent=skill.markdown;
 row.querySelector('.skills-source').href=skill.skillsUrl;row.querySelector('.github-source').href=skill.sourceUrl;
 const open=row.querySelector('.skill-open'),details=row.querySelector('.skill-details');details.id='detail-'+skill.id;open.setAttribute('aria-controls',details.id);open.setAttribute('aria-label','Ver detalhes de '+skill.id);
 open.addEventListener('click',()=>toggleSkillDetails(open,details));
 const documentCopy=document.createElement('button');documentCopy.className='skill-copy-document library-button';documentCopy.innerHTML=copyIcon+'<span class="copy-label">Copiar SKILL.md</span>';documentCopy.setAttribute('aria-label','Copiar SKILL.md de '+skill.id);documentCopy.addEventListener('click',()=>copyText(skill.markdown,documentCopy,'Copiar SKILL.md'));row.querySelector('.source-label').append(documentCopy);
 const copy=row.querySelector('.skill-copy');copy.setAttribute('aria-label','Copiar comando de '+skill.id);copy.title='Copiar comando de instalação';copy.addEventListener('click',()=>copyText(skill.command,copy));
 const download=row.querySelector('.skill-download');download.setAttribute('aria-label','Baixar '+skill.id+' em ZIP');download.title='Baixar skill e arquivos de apoio';download.addEventListener('click',()=>downloadZip(skill.download,skill.id+'.zip'));
 return row;
}
function filterLibrary(){let count=0;document.querySelectorAll('.skill-row').forEach(row=>{const meta=skillMeta[row.dataset.skill],matchCategory=category==='todas'||meta[1]===category,matchText=(row.dataset.skill+' '+meta[0]).toLocaleLowerCase().includes(libraryQuery.trim().toLocaleLowerCase());row.hidden=!(matchCategory&&matchText);if(!row.hidden)count++});document.querySelector('.library-empty').hidden=count>0;if(current==='interfaces')document.querySelector('.finder-status .count').textContent=count+' de '+orderedSkills.length+' skills';}
function setupLibrary(){
 const list=document.querySelector('.skills-list');orderedSkills.forEach(skill=>list.append(makeSkillRow(skill)));
 document.querySelectorAll('.library-filter').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;document.querySelectorAll('.library-filter').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));filterLibrary()}));
 const allCopy=document.querySelector('#copy-collection');allCopy.innerHTML=copyIcon+'<span class="copy-label">Copiar instalação</span>';allCopy.addEventListener('click',()=>copyText(getAllCommands(),allCopy,'Copiar instalação'));
 const allDownload=document.querySelector('#download-collection');allDownload.innerHTML=downloadIcon+'<span>Baixar coleção</span>';allDownload.addEventListener('click',()=>downloadZip(interfaceData.bundle,'interfaces-jakubkrehel.zip'));
 const file=document.querySelector('.interface-file');file.addEventListener('click',event=>{file.classList.add('selected');if(event.detail===0)navigate('interfaces')});file.addEventListener('dblclick',()=>navigate('interfaces'));file.addEventListener('pointerup',event=>{if(event.pointerType==='touch')navigate('interfaces')});
 file.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();navigate('interfaces')}});
}
setupLibrary();
