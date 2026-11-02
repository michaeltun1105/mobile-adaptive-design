// use_figma script. Fill PARAMS, keep the rest. Creates/updates the theme collection and rebinds a section.
const PARAMS={
  THEME: /* paste JSON from scripts/theme-generate.mjs */ null,
  COLLECTION: 'M3 Theme · <Product> (<#brand> · Tonal Spot)',
  SECTION_ID: '<node id>',
  MODE: 'Light',              // mode to set on the section's frames
  SEMANTIC_MAP: null,         // optional {'<team var name>':['<M3 role>',opacity?]} — see knowledge/theming-contrast.md
};
const T=PARAMS.THEME; if(!T) throw new Error('THEME missing');
const rgb=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255,a:1});
let col=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name===PARAMS.COLLECTION);
if(!col){ col=figma.variables.createVariableCollection(PARAMS.COLLECTION); col.renameMode(col.modes[0].modeId,'Light'); col.addMode('Dark'); }
const mode=Object.fromEntries(col.modes.map(m=>[m.name,m.modeId]));
const ex=await Promise.all(col.variableIds.map(id=>figma.variables.getVariableByIdAsync(id)));
const V={}; const get=(name)=>ex.find(v=>v.name===name)||figma.variables.createVariable(name,col,'COLOR');
T.roles.forEach((r,i)=>{ const v=get('Schemes/'+r); v.setValueForMode(mode.Light,rgb(T.Light[i])); v.setValueForMode(mode.Dark,rgb(T.Dark[i])); v.scopes=['ALL_FILLS','STROKE_COLOR','EFFECT_COLOR']; V[r]=v; });
const src=get('Source/Brand'); for(const m of Object.values(mode)) src.setValueForMode(m,rgb(T.source)); src.scopes=[]; src.description='Brand source colour. All roles generated from it ('+T.library+' · '+T.variant+').';
if(T.primaryTextLight){ const pt=get('Custom/Primary Text'); pt.setValueForMode(mode.Light,rgb(T.primaryTextLight)); pt.setValueForMode(mode.Dark,rgb(T.primaryTextDark)); pt.scopes=['ALL_FILLS']; pt.description='Brand-coloured text/icons on surfaces (generated Primary; passes 4.5:1).'; V['Custom/Primary Text']=pt; V['Schemes/Primary'].description='Light overridden to brand '+T.source+' — white label '+T.brandOnWhite+':1.'; }
for(const [n,sc] of Object.entries(T.static||{})) sc.roles.forEach((r,i)=>{ const v=get('Static/'+r); v.setValueForMode(mode.Light,rgb(sc.Light[i])); v.setValueForMode(mode.Dark,rgb(sc.Dark[i])); v.scopes=['ALL_FILLS','STROKE_COLOR','EFFECT_COLOR']; v.description='M3 static colour from '+sc.input+(sc.harmonized?' (harmonized to brand)':' (exact hue)')+'. Use '+n+'/On '+n+' and '+n+' Container/On '+n+' Container as pairs.'; V['Static/'+r]=v; });
col.description='Source '+T.source+' · '+T.variant+' · '+T.library+(Object.keys(T.overrides||{}).length?' · overrides: '+Object.keys(T.overrides).join(', '):'');
// rebind
const sec=await figma.getNodeByIdAsync(PARAMS.SECTION_ID); let pg=sec; while(pg.type!=='PAGE') pg=pg.parent; await figma.setCurrentPageAsync(pg);
figma.skipInvisibleInstanceChildren=false;
const title=s=>s.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
const vc={}; const stats={}; const skipped={};
for(const x of sec.findAll(()=>true)){ for(const prop of ['fills','strokes']){ const ps=x[prop]; if(!ps||ps===figma.mixed||!ps.length) continue;
  const sid=prop==='fills'?x.fillStyleId:x.strokeStyleId; let styleRole=null;
  if(typeof sid==='string'&&sid){ const st=await figma.getStyleByIdAsync(sid); if(st&&/^M3\/sys\/(light|dark)\//.test(st.name)) styleRole=title(st.name.split('/').pop()); }
  let ch=false; const np=[];
  for(const p of ps){ let q=p; if(p.type==='SOLID'){ const id=p.boundVariables&&p.boundVariables.color&&p.boundVariables.color.id; let role=null;
      if(id){ if(!(id in vc)) vc[id]=await figma.variables.getVariableByIdAsync(id); const v=vc[id]; if(v&&v.variableCollectionId!==col.id){ if(/^Schemes\//.test(v.name)) role=[v.name.slice(8)]; else if(PARAMS.SEMANTIC_MAP&&PARAMS.SEMANTIC_MAP[v.name]) role=PARAMS.SEMANTIC_MAP[v.name]; else skipped[v.name]=(skipped[v.name]||0)+1; } }
      else if(styleRole) role=[styleRole];
      const target=role&&(V[role[0]]); if(target){ q=figma.variables.setBoundVariableForPaint({type:'SOLID',color:p.color,opacity:role[1]!==undefined?role[1]:p.opacity,visible:p.visible,blendMode:p.blendMode},'color',target); ch=true; stats[role[0]]=(stats[role[0]]||0)+1; } }
    np.push(q); }
  if(ch){ if(styleRole){ if(prop==='fills') await x.setFillStyleIdAsync(''); else await x.setStrokeStyleIdAsync(''); } x[prop]=np; } } }
for(const f of sec.children.filter(c=>c.type==='FRAME')) f.setExplicitVariableModeForCollection(col,mode[PARAMS.MODE]);
return {collection:col.id,stats,skipped};
