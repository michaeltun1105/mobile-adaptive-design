// use_figma script. WCAG audit of visible text and small icons inside PARAMS.ROOT_IDS (sections/frames or the page).
const PARAMS={ ROOT_IDS:['<section or page id>'], FIX:false, PRIMARY_TEXT_VAR:'Custom/Primary Text', ON_PRIMARY_CONTAINER_VAR:'Schemes/On Primary Container' };
const lum=c=>{ const f=v=>v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4); return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b); };
const ratio=(a,b)=>{ const x=lum(a),y=lum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); };
const hex=c=>'#'+[c.r,c.g,c.b].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');
const vc={}; const resolve=async(p,node)=>{ const id=p.boundVariables&&p.boundVariables.color&&p.boundVariables.color.id; if(!id) return {c:p.color,name:null}; if(!(id in vc)) vc[id]=await figma.variables.getVariableByIdAsync(id); const v=vc[id]; if(!v) return {c:p.color,name:'?'}; try{ return {c:v.resolveForConsumer(node).value,name:v.name}; }catch(e){ return {c:p.color,name:v.name}; } };
const blend=(fg,a,bg)=>({r:fg.r*a+bg.r*(1-a),g:fg.g*a+bg.g*(1-a),b:fg.b*a+bg.b*(1-a)});
const visible=n=>{ let a=n; while(a&&a.type!=='PAGE'&&a.type!=='SECTION'){ if(a.visible===false||a.opacity===0) return false; a=a.parent; } return true; };
async function bgOf(node){ const nb=node.absoluteBoundingBox; let a=node;
  while(a.parent&&a.parent.type!=='PAGE'&&a.parent.type!=='SECTION'){ const par=a.parent; const idx=par.children.indexOf(a);
    for(let i=idx-1;i>=0;i--){ const s=par.children[i]; if(!s.visible||!('fills' in s)||s.fills===figma.mixed) continue; const sb=s.absoluteBoundingBox; if(!sb||!nb) continue;
      if(sb.x<=nb.x+1&&sb.y<=nb.y+1&&sb.x+sb.width>=nb.x+nb.width-1&&sb.y+sb.height>=nb.y+nb.height-1){ const f=[...s.fills].reverse().find(p=>p.visible!==false); if(f){ if(f.type!=='SOLID') return {img:true}; if((f.opacity??1)>0.5){ const r=await resolve(f,s); return {c:r.c,name:r.name}; } } } }
    if('fills' in par&&par.fills!==figma.mixed){ const f=[...par.fills].reverse().find(p=>p.visible!==false); if(f){ if(f.type!=='SOLID') return {img:true}; if((f.opacity??1)>0.5){ const r=await resolve(f,par); return {c:r.c,name:r.name}; } } }
    a=par; }
  return {c:{r:1,g:1,b:1},name:'(page)'}; }
const all=await figma.variables.getLocalVariablesAsync('COLOR'); const byName=n=>all.find(v=>v.name===n);
figma.skipInvisibleInstanceChildren=true;
const out={checked:0,fixed:0,exempt:0,onImage:0,unbound:0,fails:[]};
for(const id of PARAMS.ROOT_IDS){ const root=await figma.getNodeByIdAsync(id); if(root.type==='PAGE') await figma.setCurrentPageAsync(root); else { let p=root; while(p.type!=='PAGE') p=p.parent; await figma.setCurrentPageAsync(p); }
 for(const n of root.findAll(n=>(n.type==='TEXT'&&n.characters.trim())||((n.type==='VECTOR'||n.type==='BOOLEAN_OPERATION')&&n.width<=40&&n.height<=40))){
  if(!visible(n)||n.fills===figma.mixed||!n.fills.length) continue; const pi=n.fills.findIndex(x=>x.visible!==false&&x.type==='SOLID'); if(pi<0) continue; const p=n.fills[pi];
  if(n.type==='TEXT'&&n.characters.codePointAt(0)>=0xF0000) continue;
  const fg=await resolve(p,n); if(!fg.name) out.unbound++;
  const bg=await bgOf(n); if(bg.img){ out.onImage++; continue; }
  const a=(p.opacity??1)*(n.opacity??1); if(a<0.6){ out.exempt++; continue; }
  const r=ratio(blend(fg.c,a,bg.c),bg.c); out.checked++;
  let need=3; if(n.type==='TEXT'){ const fs=n.fontSize===figma.mixed?14:n.fontSize, fw=n.fontWeight===figma.mixed?400:n.fontWeight; need=(fs>=24||(fs>=18.66&&fw>=700))?3:4.5; }
  if(r>=need-0.01) continue;
  if(PARAMS.FIX&&fg.name==='Schemes/Primary'&&bg.name!=='Schemes/Primary'){ const t=byName(bg.name==='Schemes/Primary Container'?PARAMS.ON_PRIMARY_CONTAINER_VAR:PARAMS.PRIMARY_TEXT_VAR); if(t){ const nf=[...n.fills]; nf[pi]=figma.variables.setBoundVariableForPaint({type:'SOLID',color:p.color,opacity:p.opacity},'color',t); n.fills=nf; out.fixed++; continue; } }
  out.fails.push({id:n.id,kind:n.type==='TEXT'?'text':'icon',what:n.type==='TEXT'?n.characters.slice(0,20):n.name,fg:(fg.name||'unbound (logo?)')+' '+hex(fg.c),bg:bg.name+' '+hex(bg.c),ratio:+r.toFixed(2),need}); } }
const g={}; for(const f of out.fails){ const k=f.kind+' | '+f.fg+' on '+f.bg+' | '+f.ratio+'<'+f.need; g[k]=(g[k]||0)+1; }
return {...out,fails:out.fails.length,groups:g};
