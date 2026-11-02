// use_figma. Duplicates screens and switches them to the large-text mode of the type-scale collection,
// then reports text that is clipped, overflows its parent, overlaps a sibling or ends under the bottom inset.
// Requires text styles bound to the type-scale collection (type-scale.js). Screenshot the copies afterwards.
const PARAMS={ FRAME_IDS:['<screen frame id>'], COLLECTION:'<Product> · Type scale', MODE:'200%', GAP:80, BOTTOM_INSET:24 };
const col=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name===PARAMS.COLLECTION); if(!col) throw new Error('type-scale collection missing');
const mode=col.modes.find(m=>m.name===PARAMS.MODE); if(!mode) throw new Error('mode missing');
const report=[];
for(const id of PARAMS.FRAME_IDS){ const f=await figma.getNodeByIdAsync(id); let pg=f; while(pg.type!=='PAGE') pg=pg.parent; await figma.setCurrentPageAsync(pg);
  const name=f.name+' · '+PARAMS.MODE+' text'; const old=f.parent.children.find(n=>n.name===name); if(old) old.remove();
  const c=f.clone(); f.parent.appendChild(c); c.name=name; c.x=f.x; c.y=f.y+f.height+PARAMS.GAP; c.setExplicitVariableModeForCollection(col,mode.modeId);
  const issues=[]; const fb=c.absoluteBoundingBox;
  for(const t of c.findAll(n=>n.type==='TEXT'&&n.visible&&n.characters.trim())){ const b=t.absoluteBoundingBox, p=t.parent.absoluteBoundingBox; if(!b||!p) continue;
    if(t.textTruncation==='ENDING') issues.push(['truncates',t.characters.slice(0,24)]);
    if(b.x+b.width>p.x+p.width+1||b.y+b.height>p.y+p.height+1) issues.push(['overflows parent',t.characters.slice(0,24)]);
    if(b.y+b.height>fb.y+fb.height-PARAMS.BOTTOM_INSET) issues.push(['under bottom inset / off screen',t.characters.slice(0,24)]);
    for(const s of t.parent.children){ if(s===t||!s.visible||s.type==='TEXT'&&false) continue; const o=s.absoluteBoundingBox; if(!o) continue; if(t.parent.layoutMode&&t.parent.layoutMode!=='NONE') continue; if(b.x<o.x+o.width&&b.x+b.width>o.x&&b.y<o.y+o.height&&b.y+b.height>o.y&&s.type==='TEXT') issues.push(['overlaps',t.characters.slice(0,24)+' ↔ '+(s.characters||s.name).slice(0,16)]); } }
  const fixedH=c.findAll(n=>n.type==='FRAME'&&n.layoutMode&&n.layoutMode!=='NONE'&&n.layoutSizingVertical==='FIXED'&&n.findOne(x=>x.type==='TEXT')).length;
  report.push({screen:f.name,copy:c.id,issues:issues.slice(0,30),issueCount:issues.length,fixedHeightTextContainers:fixedH}); }
return report;
