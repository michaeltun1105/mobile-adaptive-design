// Paste the functions you need above your use_figma code. Runs INSIDE the team's copy of
// "Car App Templates Design Kit" (templates are local components there — community-kit keys can't be
// imported into other files unless the team publishes the kit as a library; then use importComponentSetByKeyAsync with the keys in car-kit.md).
const CAR={ TEMPLATES_PAGE:'Car App Templates', COMPONENTS_PAGE:'Components', SIZES:'Apps',
  MODES:['Standard Canonical','Wide','Portrait','Coolwalk','Absolute Min','Coolwalk-Absolute-Min'] };
// Find a template/component set by name (e.g. 'PaneTemplate', 'List/list item') on the kit pages.
async function carSet(name){
  for(const pn of [CAR.TEMPLATES_PAGE,CAR.COMPONENTS_PAGE]){ const p=figma.root.children.find(x=>x.name===pn); if(!p) continue; await p.loadAsync();
    const s=p.findOne(n=>(n.type==='COMPONENT_SET'||n.type==='COMPONENT')&&n.name===name); if(s) return s; }
  throw new Error('Car kit component not found: '+name+' — is this the Car App Templates kit file?'); }
// Instance of one variant, e.g. carInstance('PaneTemplate',{Size:'Standard'})
async function carInstance(name, props={}){
  const s=await carSet(name); let comp=s;
  if(s.type==='COMPONENT_SET'){ comp=s.children.find(c=>Object.entries(props).every(([k,v])=>c.name.split(', ').includes(k+'='+v)))||s.defaultVariant;
    if(!comp) throw new Error('No variant '+JSON.stringify(props)+' in '+name); }
  return comp.createInstance(); }
// App-space frame: templates bind their width/height to the "Apps" collection, so switching the mode resizes them.
async function carScreen(name, mode='Standard Canonical', parent=figma.currentPage){
  const col=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name===CAR.SIZES);
  const f=figma.createAutoLayout('VERTICAL',{name}); parent.appendChild(f); f.clipsContent=true;
  if(col){ const m=col.modes.find(x=>x.name===mode); if(m) f.setExplicitVariableModeForCollection(col,m.modeId); }
  return f; }
// Set a text layer inside an instance by layer name (loads the current fonts first).
async function carText(inst, layerName, value){
  const t=inst.findOne(n=>n.type==='TEXT'&&n.name===layerName); if(!t) return false;
  for(const f of [...new Set(t.getStyledTextSegments(['fontName']).map(s=>JSON.stringify(s.fontName)))]) await figma.loadFontAsync(JSON.parse(f));
  t.characters=value; return true; }
// Set a TEXT component property by its visible name (e.g. 'Primary text').
function carProp(inst, label, value){ const k=Object.keys(inst.componentProperties).find(p=>p.split('#')[0]===label); if(k) inst.setProperties({[k]:value}); return !!k; }
