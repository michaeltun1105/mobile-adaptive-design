// use_figma (read-only). Interactive elements smaller than the platform minimum (Android 48dp, iOS 44pt).
const PARAMS={ ROOT_IDS:['<section or frame id>'], MIN:48, NAME_HINT:/button|icon button|chip|checkbox|radio|switch|toggle|tab|nav item|link|fab|menu item|list item/i };
const out=[];
for(const id of PARAMS.ROOT_IDS){ const r=await figma.getNodeByIdAsync(id); let pg=r; while(pg.type!=='PAGE') pg=pg.parent; await figma.setCurrentPageAsync(pg);
  for(const n of r.findAll(n=>n.visible&&(n.type==='INSTANCE'||n.type==='FRAME')&&(PARAMS.NAME_HINT.test(n.name)||(n.reactions&&n.reactions.length)))){
    if(n.width<PARAMS.MIN||n.height<PARAMS.MIN){ let fr=n; while(fr.parent&&fr.parent.type!=='SECTION'&&fr.parent.type!=='PAGE') fr=fr.parent; out.push({frame:fr.name,node:n.name,id:n.id,size:Math.round(n.width)+'×'+Math.round(n.height)}); } } }
return {count:out.length,items:out.slice(0,60),note:'A small visual is fine if its tappable area (padding / parent hit area) reaches the minimum — check before fixing.'};
