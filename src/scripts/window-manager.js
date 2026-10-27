// The desktop has two modeless windows. This is the only owner of their stacking and focus.
const desktopWindows=(()=>{
 const windows={finder:document.querySelector('#finder'),tools:document.querySelector('#tool-window')};
 const lastFocus=new Map();
 function activate(id){
  if(!windows[id]?.open)return;
  document.body.dataset.frontWindow=id;
  for(const [key,element] of Object.entries(windows))element.style.zIndex=key===id?'8':'6';
 }
 function afterClose(id,trigger){
  const wasFront=document.body.dataset.frontWindow===id;
  const next=Object.keys(windows).find(key=>key!==id&&windows[key].open);
  if(next){
   activate(next);
   if(wasFront){
    let target=lastFocus.get(next);
    if(!target?.isConnected||target.disabled||target.closest('[hidden],[inert]'))target=windows[next].querySelector('button');
    target?.focus({preventScroll:true});
   }
  }else{document.body.dataset.frontWindow='';trigger?.focus({preventScroll:true})}
 }
 function bounds(){
  const dockTop=document.querySelector('.tool-dock')?.getBoundingClientRect().top;
  const top=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--work-top'))||12;
  return {left:12,top,right:innerWidth-12,bottom:dockTop>top?dockTop-16:innerHeight-126};
 }
 function move(id,rect){
  const area=bounds(),element=windows[id];
  const left=Math.max(area.left,Math.min(area.right-rect.width,rect.left));
  const top=Math.max(area.top,Math.min(area.bottom-rect.height,rect.top));
  const prefix=id==='finder'?'finder':'tool';
  element.style.setProperty('--'+prefix+'-x',left+rect.width/2+'px');
  element.style.setProperty('--'+prefix+'-y',top+rect.height/2+'px');
 }
 for(const [id,element] of Object.entries(windows)){
  element.addEventListener('pointerdown',()=>activate(id));
  element.addEventListener('focusin',event=>{lastFocus.set(id,event.target);activate(id)});
 }
 window.addEventListener('resize',()=>{
  for(const [id,element] of Object.entries(windows)){
   const prefix=id==='finder'?'finder':'tool';
   element.style.removeProperty('--'+prefix+'-x');element.style.removeProperty('--'+prefix+'-y');
  }
 });
 return {activate,afterClose,move,bounds};
})();
