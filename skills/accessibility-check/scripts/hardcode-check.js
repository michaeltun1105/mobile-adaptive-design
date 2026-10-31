// use_figma (read-only). Finds raw values: SOLID paints not bound to a variable, texts without a text style,
// icons that are not component instances. Images, gradients, guides (names starting with "_") and logos are skipped.
const PARAMS={ ROOT_IDS:['<section or frame id>'], SKIP_NAME:/^_|logo|photo|image|avatar|illustration/i };
const res={unboundPaints:0,unstyledTexts:0,examples:[]};
const skipped=n=>{ let a=n; while(a&&a.type!=='PAGE'&&a.type!=='SECTION'){ if(PARAMS.SKIP_NAME.test(a.name)) return true; a=a.parent; } return false; };
for(const id of PARAMS.ROOT_IDS){ const r=await figma.getNodeByIdAsync(id); let pg=r; while(pg.type!=='PAGE') pg=pg.parent; await figma.setCurrentPageAsync(pg);
  figma.skipInvisibleInstanceChildren=true;
  for(const n of r.findAll(n=>n.visible)){ if(skipped(n)) continue;
    for(const prop of ['fills','strokes']){ const ps=n[prop]; if(!ps||ps===figma.mixed) continue; const st=prop==='fills'?n.fillStyleId:n.strokeStyleId; if(typeof st==='string'&&st) continue;
      for(const p of ps) if(p.type==='SOLID'&&p.visible!==false&&!(p.boundVariables&&p.boundVariables.color)){ res.unboundPaints++; if(res.examples.length<40) res.examples.push(['paint',n.name,n.id]); } }
    if(n.type==='TEXT'&&n.characters.trim()&&(!n.textStyleId||n.textStyleId===figma.mixed||n.textStyleId==='')){ res.unstyledTexts++; if(res.examples.length<40) res.examples.push(['text',n.characters.slice(0,20),n.id]); } } }
return res;
