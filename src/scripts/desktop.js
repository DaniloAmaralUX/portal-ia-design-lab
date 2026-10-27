const $=selector=>document.querySelector(selector);
const names=['skills','plugins','recursos'];
const desktopIcons=__DESKTOP_ICONS__;
const folders=[...document.querySelectorAll('.folder')],finder=$('#finder');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)'),finePointer=matchMedia('(hover:hover) and (pointer:fine)');
let keyboardMode=false,current='skills',selected=null,lastTrigger=null,minimized=false,closeTimer,openFrame,history=[],historyIndex=-1;
const instant=()=>keyboardMode||reducedMotion.matches;
document.addEventListener('keydown',()=>{keyboardMode=true;document.body.classList.add('keyboard-mode')},{capture:true});
document.addEventListener('pointerdown',()=>{keyboardMode=false;document.body.classList.remove('keyboard-mode')},{capture:true});
function folderIcon(name){return '<img class="desktop-object" src="'+desktopIcons[name]+'" width="48" height="48" alt="" draggable="false">'}
function selectFolder(folder){selected=folder;folders.forEach(item=>item.classList.toggle('selected',item===folder));}
folders.forEach(folder=>{
 const art=folder.querySelector('.folder-art');
 art.innerHTML=folderIcon(folder.dataset.folder);
 folder.addEventListener('click',event=>{selectFolder(folder);if(event.detail===0)openFolder(folder.dataset.folder,folder,true)});
 folder.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();selectFolder(folder);openFolder(folder.dataset.folder,folder,true)}});
 folder.addEventListener('dblclick',()=>openFolder(folder.dataset.folder,folder));
 folder.addEventListener('pointerup',event=>{if(event.pointerType==='touch')openFolder(folder.dataset.folder,folder)});
});
$('.launchpad').addEventListener('click',event=>{if(!event.target.closest('.folder'))selectFolder(null)});
$('.folders').addEventListener('keydown',event=>{
 if((event.metaKey||event.ctrlKey)&&event.key==='ArrowDown'){event.preventDefault();const active=document.activeElement.closest('.folder');if(active)openFolder(active.dataset.folder,active,true);return;}
 if(!['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
 event.preventDefault();const index=folders.indexOf(document.activeElement),next=event.key==='Home'?0:event.key==='End'?2:(index+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+3)%3;
 selectFolder(folders[next]);folders[next].focus();
});
names.forEach(name=>{
 const side=document.createElement('button');side.className='sidebar-folder';side.dataset.folder=name;side.innerHTML=folderIcon(name)+'<span>'+name+'</span>';side.addEventListener('click',()=>navigate(name));$('.sidebar-folders').append(side);
});
function renderFolder(){
 const rootFolder=current==='interfaces'?'skills':current;
 $('#folder-title').textContent=current==='interfaces'?'INTERFACES':current;$('.window-heading>.location-icon').src=desktopIcons[rootFolder];$('.finder-status>.location-icon').src=desktopIcons[rootFolder];$('#path-name').textContent=current==='interfaces'?'skills › INTERFACES':current;
 $('.finder-empty').hidden=current==='skills'||current==='interfaces';$('.folder-files').hidden=current!=='skills';$('.interfaces-page').hidden=current!=='interfaces';finder.classList.toggle('library-open',current==='interfaces');
 $('.finder-empty>.empty-location-icon').src=desktopIcons[rootFolder];$('#empty-title').textContent='Esta pasta está vazia';$('#folder-description').textContent='';
 $('.interface-file').hidden=false;
 document.querySelectorAll('.sidebar-folder').forEach(el=>el.setAttribute('aria-current',String(el.dataset.folder===rootFolder)));
 folders.forEach(el=>{el.setAttribute('aria-expanded',String(finder.open&&el.dataset.folder===rootFolder));el.classList.toggle('running',minimized&&el.dataset.folder===rootFolder)});
 $('#back').disabled=historyIndex<=0;$('#forward').disabled=historyIndex>=history.length-1;$('#window-search').value='';
 $('.finder-status .count').textContent=current==='skills'?'1 item':current==='interfaces'?'16 skills':'0 itens';
 libraryQuery='';if(current==='interfaces')filterLibrary();
 $('.finder-content').scrollTop=0;
 $('.view-toggle').hidden=current==='interfaces';
 if(current==='interfaces'&&finder.open)$('#library-title').focus({preventScroll:true});
}
function navigate(name,record=true){current=name;if(record){history=history.slice(0,historyIndex+1);if(history.at(-1)!==name){history.push(name);historyIndex=history.length-1}}renderFolder();}
function openFolder(name,trigger,byKeyboard=false){

 const restoring=minimized&&(current==='interfaces'?'skills':current)===name;
 clearTimeout(closeTimer);cancelAnimationFrame(openFrame);minimized=false;lastTrigger=trigger||lastTrigger;finder.classList.remove('closing');finder.classList.toggle('instant',byKeyboard||instant());
 const wasOpen=finder.open;if(!wasOpen)finder.show();desktopWindows.activate('finder');
 if(restoring)folders.forEach(el=>{el.classList.remove('running');el.setAttribute('aria-expanded',String(el.dataset.folder===(current==='interfaces'?'skills':current)))});else navigate(name);
 if(wasOpen||byKeyboard||instant())finder.classList.add('visible');else{void finder.offsetWidth;openFrame=requestAnimationFrame(()=>finder.classList.add('visible'));}
 if(byKeyboard)$('#close-window').focus();
}
function finishClose(keepRunning=false){clearTimeout(closeTimer);cancelAnimationFrame(openFrame);minimized=keepRunning;finder.classList.remove('visible','closing');if(finder.open)finder.close();folders.forEach(el=>{el.setAttribute('aria-expanded','false');el.classList.toggle('running',keepRunning&&el.dataset.folder===(current==='interfaces'?'skills':current))});desktopWindows.afterClose('finder',lastTrigger)}
function closeWindow(minimize=false){clearTimeout(closeTimer);cancelAnimationFrame(openFrame);finder.classList.toggle('instant',instant());if(instant()){finishClose(minimize);return}finder.classList.remove('visible');finder.classList.add('closing');closeTimer=setTimeout(()=>finishClose(minimize),120)}
$('#close-window').addEventListener('click',()=>closeWindow());$('#minimize-window').addEventListener('click',()=>closeWindow(true));
function maximize(){finder.classList.toggle('maximized');$('#maximize-window').setAttribute('aria-label',finder.classList.contains('maximized')?'Restaurar janela':'Ampliar janela')}
$('#maximize-window').addEventListener('click',maximize);$('.finder-titlebar').addEventListener('dblclick',event=>{if(!event.target.closest('button'))maximize()});
$('#back').addEventListener('click',()=>{if(historyIndex>0){historyIndex--;navigate(history[historyIndex],false)}});$('#forward').addEventListener('click',()=>{if(historyIndex<history.length-1){historyIndex++;navigate(history[historyIndex],false)}});
document.querySelectorAll('[data-view-button]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-view-button]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));$('.finder-content').dataset.view=button.dataset.viewButton}));
$('#window-search').addEventListener('input',event=>{
 if(current==='interfaces'){libraryQuery=event.target.value;filterLibrary();return}
 if(current==='skills'){const found='interfaces'.includes(event.target.value.trim().toLowerCase());$('.interface-file').hidden=!found;$('.finder-empty').hidden=found;$('#empty-title').textContent='Nenhum resultado';$('#folder-description').textContent='Busque por INTERFACES.';$('.finder-status .count').textContent=found?'1 item':'0 itens';return}
 $('#empty-title').textContent=event.target.value?'Nenhum resultado':'Esta pasta está vazia';$('#folder-description').textContent=event.target.value?'Nenhum item nesta pasta corresponde à busca.':''
});
document.addEventListener('keydown',event=>{
 if(event.defaultPrevented||(document.body.dataset.frontWindow==='tools'&&document.querySelector('#tool-window')?.open))return;
 if(event.key==='Escape'&&finder.open){event.preventDefault();finishClose();}
 if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='w'&&finder.open){event.preventDefault();finishClose();}
 if((event.metaKey||event.ctrlKey)&&['k','f'].includes(event.key.toLowerCase())){event.preventDefault();if(!finder.open)openFolder('skills',folders[0],true);$('#window-search').focus();}
});
// Keep the titlebar reachable and drag from the original grab point.
let drag=null;
$('.finder-titlebar').addEventListener('pointerdown',event=>{if(event.target.closest('button')||finder.classList.contains('maximized')||drag||event.button!==0)return;const rect=finder.getBoundingClientRect();drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height};event.currentTarget.setPointerCapture(event.pointerId);});
$('.finder-titlebar').addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.id)return;desktopWindows.move('finder',{left:drag.left+event.clientX-drag.x,top:drag.top+event.clientY-drag.y,width:drag.width,height:drag.height})});
function stopDrag(event){if(drag?.id===event.pointerId)drag=null;}
$('.finder-titlebar').addEventListener('pointerup',stopDrag);$('.finder-titlebar').addEventListener('pointercancel',stopDrag);$('.finder-titlebar').addEventListener('lostpointercapture',stopDrag);
window.addEventListener('resize',()=>{finder.style.removeProperty('--finder-x');finder.style.removeProperty('--finder-y')});
