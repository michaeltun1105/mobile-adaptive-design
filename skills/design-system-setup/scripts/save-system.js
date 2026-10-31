// use_figma. Saves the design system decisions in the file (shared plugin data) and draws/updates a visible frame.
// Fill PARAMS with what was decided/built. No product values are hard-coded here.
const PARAMS={
  SYSTEM:{ product:'<Product>', platforms:['android'],            // 'ios' | 'android' | both
    brand:'<#hex>', variant:'Tonal Spot', modes:['Light','Dark'],
    colorCollection:'<collection name>', typeCollection:'<Product> · Type scale',
    textStylePrefix:{android:'<Product>/M3', ios:'<Product>/iOS'},
    fonts:{title:'<family>', body:'<family>'},                   // per platform if different: {android:{…}, ios:{…}}
    icons:{android:{source:'material-symbols', weight:600}, ios:{source:'sf-symbols'}},
    overrides:[], iconFrameId:null, notes:'' },
  PAGE_ID:'<page id for the visible frame>', FRAME_X:0, FRAME_Y:0 };
const sys={...PARAMS.SYSTEM, savedAt:new Date().toISOString()};
figma.root.setSharedPluginData('mobile_adaptive','system',JSON.stringify(sys));
const pg=await figma.getNodeByIdAsync(PARAMS.PAGE_ID); await figma.setCurrentPageAsync(pg);
const name='_Design system · '+sys.product;
let f=pg.children.find(n=>n.name===name); if(f) f.remove();
f=figma.createFrame(); pg.appendChild(f); f.name=name; f.x=PARAMS.FRAME_X; f.y=PARAMS.FRAME_Y; f.layoutMode='VERTICAL'; f.itemSpacing=16; f.paddingTop=f.paddingBottom=f.paddingLeft=f.paddingRight=32; f.primaryAxisSizingMode='AUTO'; f.counterAxisSizingMode='AUTO'; f.cornerRadius=16;
await figma.loadFontAsync({family:'Inter',style:'Regular'}); await figma.loadFontAsync({family:'Inter',style:'Bold'});
const txt=(c,b)=>{ const t=figma.createText(); t.fontName={family:'Inter',style:b?'Bold':'Regular'}; t.characters=c; t.fontSize=b?20:13; f.appendChild(t); return t; };
txt(name,true); txt('Platforms: '+sys.platforms.join(', ')+' · Brand '+sys.brand+' · '+sys.variant+' · Modes '+sys.modes.join('/'));
txt('Colours: '+sys.colorCollection+' · Type: '+JSON.stringify(sys.textStylePrefix)+' · Fonts: '+JSON.stringify(sys.fonts));
txt('Icons: '+JSON.stringify(sys.icons)+(sys.overrides.length?' · Overrides: '+JSON.stringify(sys.overrides):''));
txt('Saved '+sys.savedAt.slice(0,10)+' — the plugin reads this; edit by re-running design-system-setup.');
// swatches bound to the colour collection (first 12 Schemes/* or all brand-ish vars)
const col=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name===sys.colorCollection);
if(col){ const row=figma.createFrame(); row.name='Swatches'; row.layoutMode='HORIZONTAL'; row.layoutWrap='WRAP'; row.itemSpacing=8; row.counterAxisSpacing=8; row.fills=[]; row.resize(720,10); row.primaryAxisSizingMode='FIXED'; row.counterAxisSizingMode='AUTO'; f.appendChild(row);
  for(const id of col.variableIds){ const v=await figma.variables.getVariableByIdAsync(id); if(v.resolvedType!=='COLOR'||!v.scopes.length) continue; const r=figma.createRectangle(); r.resize(48,48); r.cornerRadius=8; r.name=v.name; r.fills=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',v)]; row.appendChild(r); } }
return {saved:sys, frame:f.id};
