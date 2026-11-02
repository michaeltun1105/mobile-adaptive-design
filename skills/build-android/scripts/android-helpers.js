// Android-only helpers (paste with helpers.js when needed). Kit keys: Material 3 Design Kit (published).
// Android status bar (top) + gesture bar (bottom); keys from reference/components.md.
async function addSystemBars(frame,{statusKey='9ba30f3c7a2122d9ef05a0de9d62435e820e9ed7',gestureKey='5ea48ef438e1a60e7d3190b3403eab5acef728f1',lightIcons=false}={}){ const SB=await figma.importComponentByKeyAsync(statusKey), GB=await figma.importComponentByKeyAsync(gestureKey); const W=frame.width,H=frame.height;
  const sb=SB.createInstance(); frame.appendChild(sb); if(frame.layoutMode&&frame.layoutMode!=='NONE') sb.layoutPositioning='ABSOLUTE'; sb.resize(W,52); sb.x=0; sb.y=0; sb.constraints={horizontal:'STRETCH',vertical:'MIN'};
  const gb=GB.createInstance(); frame.appendChild(gb); if(frame.layoutMode&&frame.layoutMode!=='NONE') gb.layoutPositioning='ABSOLUTE'; gb.resize(W,24); gb.x=0; gb.y=H-24; gb.constraints={horizontal:'STRETCH',vertical:'MAX'};
  if(lightIcons) for(const n of [sb,gb]) for(const v of n.findAll(x=>'fills' in x&&x.fills!==figma.mixed&&x.fills.length&&!['FRAME','INSTANCE'].includes(x.type))) try{ v.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}]; }catch(e){}
  return {sb,gb}; }
// 24×24 icon component from a 24-dp path (scripts/svg-to-24.py). Verify len/sum first. Fill = a paint bound to a variable.
function createIconComponent(name,d,{len,sum},fillPaint,parent){ let s=0; for(const c of d) s+=c.charCodeAt(0); if(d.length!==len||s!==sum) throw new Error('checksum '+name);
  const fr=figma.createNodeFromSvg(`<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='${d}' fill='#000'/></svg>`); fr.x=0; fr.y=0; const v=fr.children[0]; v.name='icon'; v.fills=[fillPaint]; v.constraints={horizontal:'SCALE',vertical:'SCALE'};
  const c=figma.createComponent(); c.resize(24,24); c.fills=[]; c.appendChild(v); fr.remove(); c.name=name; c.description='Material Symbols Outlined · '+name; if(parent) parent.appendChild(c); return c; }
