// use_figma. Creates/updates the M3 spacing and corner (shape) scales as number variables, so padding, gaps and
// corner radii can be bound instead of typed (no hard-coded values). Values are Material's system tokens
// (md.sys.measurement.space*, md.sys.shape.corner.* — corner values verified against androidx ShapeTokens 2026-11-02),
// not product values. Optionally binds an existing section: exact matches only, everything else is reported.
const PARAMS={ COLLECTION:'<Product> · Spacing & shape', BIND_ROOT_IDS:[], /* optional: frames/sections to bind */ };
// space<N> = 8dp × N/100 (space100 = 8dp). Nested units 25/50/75/125 = 2/4/6/10dp.
const SPACE=[0,25,50,75,100,125,150,200,250,300,350,400,500,600,700,800,900];
const CORNER=[['none',0],['extra-small',4],['small',8],['medium',12],['large',16],['large-increased',20],['extra-large',28],['extra-large-increased',32],['extra-extra-large',48],['full',1000]];
let col=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name===PARAMS.COLLECTION);
if(!col){ col=figma.variables.createVariableCollection(PARAMS.COLLECTION); col.renameMode(col.modes[0].modeId,'Default'); }
const mode=col.modes[0].modeId;
const vars=await Promise.all(col.variableIds.map(id=>figma.variables.getVariableByIdAsync(id)));
const get=(name,val,scopes,desc)=>{ let v=vars.find(x=>x.name===name); if(!v){ v=figma.variables.createVariable(name,col,'FLOAT'); vars.push(v); }
  v.setValueForMode(mode,val); v.scopes=scopes; v.description=desc; return v; };
const spaceBy={}, cornerBy={};
for(const n of SPACE){ const dp=8*n/100; const key='space'+(n===0?'0':n<100?String(n).padStart(3,'0'):n); /* space0, space025 … space900 */ spaceBy[dp]=get('Spacing/'+key,dp,['GAP'],'md.sys.measurement.'+key+' = '+dp+'dp (padding & gaps; GAP scope includes padding)'); }
for(const [k,dp] of CORNER) cornerBy[dp]=get('Shape/corner-'+k,dp,['CORNER_RADIUS'],'md.sys.shape.corner.'+k+(k==='full'?' (fully rounded)':' = '+dp+'dp'));
col.description='M3 system tokens: spacing (space100 = 8dp) and corner radius scale. Add product tokens with the same multiplier pattern (space225 = 18dp).';
// optional binding of an existing section (frames only; instances keep the kit's own bindings)
const bound={padding:0,gap:0,corner:0}, unmatched={};
for(const id of PARAMS.BIND_ROOT_IDS){ const r=await figma.getNodeByIdAsync(id); let pg=r; while(pg.type!=='PAGE') pg=pg.parent; await figma.setCurrentPageAsync(pg);
  for(const n of r.findAll(n=>(n.type==='FRAME'||n.type==='COMPONENT')&&!(n.parent&&n.parent.type==='INSTANCE'))){
    if(n.layoutMode&&n.layoutMode!=='NONE'){
      for(const p of ['paddingTop','paddingBottom','paddingLeft','paddingRight','itemSpacing']){ const val=n[p]; if(!val||(n.boundVariables&&n.boundVariables[p])) continue;
        if(spaceBy[val]){ n.setBoundVariable(p,spaceBy[val]); bound[p==='itemSpacing'?'gap':'padding']++; } else unmatched[p+' '+val]=(unmatched[p+' '+val]||0)+1; } }
    if(typeof n.cornerRadius==='number'&&n.cornerRadius>0&&!(n.boundVariables&&n.boundVariables.topLeftRadius)){
      const c=cornerBy[n.cornerRadius]; if(c){ for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius']) n.setBoundVariable(k,c); bound.corner++; } else unmatched['corner '+n.cornerRadius]=(unmatched['corner '+n.cornerRadius]||0)+1; } } }
return {collection:col.id, variables:col.variableIds.length, bound, unmatched};
