// use_figma. Creates/updates text styles for one platform and binds size/line height to a number collection
// with modes for text scaling. Values below are the platform defaults (M3 type scale / Apple HIG); fonts come
// from PARAMS (the person's answer — never hard-code a product font here).
const PARAMS={ PLATFORM:'android', PREFIX:'<Product>/M3', COLLECTION:'<Product> · Type scale',
  FONTS:{ title:'<title family>', body:'<body family>' },          // brand typeface (display/headline/title) · plain typeface (body/label)
  WEIGHTS:{ 400:'Regular', 500:'Medium', 600:'SemiBold', 700:'Bold' }, // style names inside those families
  EMPHASIZED:true,             // Android: also create the 15 M3 Expressive emphasized styles (<PREFIX>/emphasized/<role>)
  LANGUAGE_HEIGHT:'small' };   // M3 language height: small (Latin except Vietnamese, Cyrillic, Greek, Hebrew) · medium (Vietnamese, Thai, CJK, Arabic, Hindi… ≈ +7%) · large (Burmese, Telugu ≈ +30%) · xl (Nastaliq ≈ +100%)
// [role, size, lineHeight, kind(title|body), weight, emphasizedWeight, tracking(px)] — M3 baseline (verify in the kit when exact numbers matter)
const ANDROID=[['display/large',57,64,'title',400,500,-0.25],['display/medium',45,52,'title',400,500,0],['display/small',36,44,'title',400,500,0],
 ['headline/large',32,40,'title',400,500,0],['headline/medium',28,36,'title',400,500,0],['headline/small',24,32,'title',400,500,0],
 ['title/large',22,28,'title',400,500,0],['title/medium',16,24,'body',500,700,0.15],['title/small',14,20,'body',500,700,0.1],
 ['body/large',16,24,'body',400,500,0.5],['body/medium',14,20,'body',400,500,0.25],['body/small',12,16,'body',400,500,0.4],
 ['label/large',14,20,'body',500,700,0.1],['label/medium',12,16,'body',500,700,0.5],['label/small',11,16,'body',500,700,0.5]];
const A200={8:16,10:20,11:22,12:24,14:26,16:28,18:30,20:34,22:35,24:36,28:37,30:38,32:39,36:41,45:50,57:61}; // Android 14 non-linear 200% (approx.; interpolate) — verify in FS source
const IOS=[['Large Title',34,41,'title',400],['Title 1',28,34,'title',400],['Title 2',22,28,'title',400],['Title 3',20,25,'title',400],['Headline',17,22,'body',600],['Body',17,22,'body',400],['Callout',16,21,'body',400],['Subheadline',15,20,'body',400],['Footnote',13,18,'body',400],['Caption 1',12,16,'body',400],['Caption 2',11,13,'body',400]];
const IOS_XXXL={'Large Title':[40,47],'Title 1':[34,40],'Title 2':[28,34],'Title 3':[26,31],'Headline':[23,29],'Body':[23,29],'Callout':[22,28],'Subheadline':[21,27],'Footnote':[19,24],'Caption 1':[18,23],'Caption 2':[17,22]};
const IOS_AX5={'Large Title':[60,70],'Title 1':[58,68],'Title 2':[56,66],'Title 3':[55,65],'Headline':[53,62],'Body':[53,62],'Callout':[51,60],'Subheadline':[49,58],'Footnote':[44,52],'Caption 1':[43,51],'Caption 2':[40,48]}; // Apple HIG Dynamic Type — verify
const LH={small:1,medium:1.07,large:1.3,xl:2}[PARAMS.LANGUAGE_HEIGHT]||1;
const lerp=s=>{ const ks=Object.keys(A200).map(Number).sort((a,b)=>a-b); if(A200[s]) return A200[s]; let lo=ks.filter(k=>k<s).pop(), hi=ks.find(k=>k>s); if(!lo) return s*2; if(!hi) return s; return A200[lo]+(A200[hi]-A200[lo])*(s-lo)/(hi-lo); };
const ios=PARAMS.PLATFORM==='ios'; const rows=ios?IOS:ANDROID;
const modes=ios?['Default (Large)','xxxLarge','AX5']:['100%','200%'];
let col=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name===PARAMS.COLLECTION);
if(!col){ col=figma.variables.createVariableCollection(PARAMS.COLLECTION); col.renameMode(col.modes[0].modeId,modes[0]); }
for(const m of modes) if(!col.modes.find(x=>x.name===m)) col.addMode(m);
const mid=Object.fromEntries(col.modes.map(m=>[m.name,m.modeId]));
const vars=await Promise.all(col.variableIds.map(id=>figma.variables.getVariableByIdAsync(id)));
const num=(name)=>{ let v=vars.find(x=>x.name===name); if(!v){ v=figma.variables.createVariable(name,col,'FLOAT'); vars.push(v);} v.scopes=name.endsWith('size')?['FONT_SIZE']:['LINE_HEIGHT']; return v; };
// load a family/weight; fall back to the nearest lighter weight the family has, then Regular
const fontCache={}, missing=[];
const font=async(kind,w)=>{ const fam=PARAMS.FONTS[kind]; const k=fam+w; if(fontCache[k]) return fontCache[k];
  for(const tw of [w,...[700,600,500,400].filter(x=>x<w)]){ const f={family:fam,style:PARAMS.WEIGHTS[tw]}; try{ await figma.loadFontAsync(f); if(tw!==w) missing.push(fam+' '+PARAMS.WEIGHTS[w]+' → '+f.style); return fontCache[k]=f; }catch(e){} }
  throw new Error('Font not available: '+fam); };
const styles=await figma.getLocalTextStylesAsync(); const out=[];
const upsert=async(name,kind,w,size,lh,track,vs,vl)=>{ let st=styles.find(s=>s.name===name); if(!st){ st=figma.createTextStyle(); st.name=name; styles.push(st); }
  st.fontName=await font(kind,w); st.fontSize=size; st.lineHeight={unit:'PIXELS',value:lh}; st.letterSpacing={unit:'PIXELS',value:track||0};
  st.setBoundVariable('fontSize',vs); st.setBoundVariable('lineHeight',vl); out.push(name); };
for(const [role,size,lh0,kind,w,ew,track] of rows){
  const lh=Math.round(lh0*LH); const vs=num(role+'/size'), vl=num(role+'/line-height');
  vs.setValueForMode(mid[modes[0]],size); vl.setValueForMode(mid[modes[0]],lh);
  if(ios){ vs.setValueForMode(mid['xxxLarge'],IOS_XXXL[role][0]); vl.setValueForMode(mid['xxxLarge'],Math.round(IOS_XXXL[role][1]*LH)); vs.setValueForMode(mid['AX5'],IOS_AX5[role][0]); vl.setValueForMode(mid['AX5'],Math.round(IOS_AX5[role][1]*LH)); }
  else { const s2=Math.round(lerp(size)); vs.setValueForMode(mid['200%'],s2); vl.setValueForMode(mid['200%'],Math.round(s2*lh/size)); }
  await upsert(PARAMS.PREFIX+'/'+role,kind,w,size,lh,track,vs,vl);
  if(!ios && PARAMS.EMPHASIZED) await upsert(PARAMS.PREFIX+'/emphasized/'+role,kind,ew,size,lh,track,vs,vl); }
return {collection:col.id, modes, styles:out.length, languageHeight:PARAMS.LANGUAGE_HEIGHT, weightFallbacks:[...new Set(missing)]};
