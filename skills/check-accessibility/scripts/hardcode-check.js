// use_figma (read-only). Finds raw values: SOLID paints not bound to a variable, texts without a text style,
// icons that are not component instances; with CHECK_SCALES also padding/gaps/corner radii not bound to a variable
// (frames outside instances only — kit instances carry their own tokens). Images, gradients, guides (names starting with "_") and logos are skipped.
const PARAMS={ ROOT_IDS:['<section or frame id>'], SKIP_NAME:/^_|logo|photo|image|avatar|illustration/i, CHECK_SCALES:true };
const res={unboundPaints:0,unstyledTexts:0,unboundSpacing:0,unboundCorners:0,examples:[]};
const skipped=n=>{ let a=n; while(a&&a.type!=='PAGE'&&a.type!=='SECTION'){ if(PARAMS.SKIP_NAME.test(a.name)) return true; a=a.parent; } return false; };
for(const id of PARAMS.ROOT_IDS){ const r=await figma.getNodeByIdAsync(id); let pg=r; while(pg.type!=='PAGE') pg=pg.parent; await figma.setCurrentPageAsync(pg);
  figma.skipInvisibleInstanceChildren=true;
  for(const n of r.findAll(n=>n.visible)){ if(skipped(n)) continue;
    for(const prop of ['fills','strokes']){ const ps=n[prop]; if(!ps||ps===figma.mixed) continue; const st=prop==='fills'?n.fillStyleId:n.strokeStyleId; if(typeof st==='string'&&st) continue;
      for(const p of ps) if(p.type==='SOLID'&&p.visible!==false&&!(p.boundVariables&&p.boundVariables.color)){ res.unboundPaints++; if(res.examples.length<40) res.examples.push(['paint',n.name,n.id]); } }
    if(n.type==='TEXT'&&n.characters.trim()&&(!n.textStyleId||n.textStyleId===figma.mixed||n.textStyleId==='')){ res.unstyledTexts++; if(res.examples.length<40) res.examples.push(['text',n.characters.slice(0,20),n.id]); }
    if(PARAMS.CHECK_SCALES&&n.type==='FRAME'&&!(n.parent&&n.parent.type==='INSTANCE')){ const bv=n.boundVariables||{};
      if(n.layoutMode&&n.layoutMode!=='NONE') for(const p of ['paddingTop','paddingBottom','paddingLeft','paddingRight','itemSpacing']) if(n[p]>0&&!bv[p]){ res.unboundSpacing++; if(res.examples.length<40) res.examples.push(['spacing '+p+'='+n[p],n.name,n.id]); }
      if(typeof n.cornerRadius==='number'&&n.cornerRadius>0&&!bv.topLeftRadius){ res.unboundCorners++; if(res.examples.length<40) res.examples.push(['corner '+n.cornerRadius,n.name,n.id]); } } } }
return res;
