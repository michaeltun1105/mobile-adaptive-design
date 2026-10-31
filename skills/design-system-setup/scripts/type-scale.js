// use_figma. Creates/updates text styles for one platform and binds size/line height to a number collection
// with modes for text scaling. Values below are the platform defaults; fonts come from PARAMS (never hard-code).
const PARAMS={ PLATFORM:'android', PREFIX:'<Product>/M3', COLLECTION:'<Product> · Type scale',
  TITLE_FONT:{family:'<family>',style:'Regular'}, TITLE_EMPH:{family:'<family>',style:'Medium'}, BODY_FONT:{family:'<family>',style:'Regular'}, BODY_EMPH:{family:'<family>',style:'Medium'} };
// [role, size, lineHeight, kind(title|body), emphasized?]
const ANDROID=[['display/large',57,64,'title'],['display/medium',45,52,'title'],['display/small',36,44,'title'],['headline/large',32,40,'title',1],['headline/medium',28,36,'title',1],['headline/small',24,32,'title',1],['title/large',22,28,'title',1],['title/medium',16,24,'title',1],['title/small',14,20,'title',1],['body/large',16,24,'body'],['body/medium',14,20,'body'],['body/small',12,16,'body'],['label/large',14,20,'body',1],['label/medium',12,16,'body',1],['label/small',11,16,'body',1]];
const A200={8:16,10:20,11:22,12:24,14:26,16:28,18:30,20:34,22:35,24:36,28:37,30:38,32:39,36:41,45:50,57:61}; // Android 14 non-linear 200% (approx.; interpolate) — verify in FS source
const IOS=[['Large Title',34,41,'title',1],['Title 1',28,34,'title',1],['Title 2',22,28,'title',1],['Title 3',20,25,'title',1],['Headline',17,22,'body',1],['Body',17,22,'body'],['Callout',16,21,'body'],['Subheadline',15,20,'body'],['Footnote',13,18,'body'],['Caption 1',12,16,'body'],['Caption 2',11,13,'body']];
const IOS_XXXL={'Large Title':[40,47],'Title 1':[34,40],'Title 2':[28,34],'Title 3':[26,31],'Headline':[23,29],'Body':[23,29],'Callout':[22,28],'Subheadline':[21,27],'Footnote':[19,24],'Caption 1':[18,23],'Caption 2':[17,22]};
const IOS_AX5={'Large Title':[60,70],'Title 1':[58,68],'Title 2':[56,66],'Title 3':[55,65],'Headline':[53,62],'Body':[53,62],'Callout':[51,60],'Subheadline':[49,58],'Footnote':[44,52],'Caption 1':[43,51],'Caption 2':[40,48]}; // Apple HIG Dynamic Type — verify
const lerp=s=>{ const ks=Object.keys(A200).map(Number).sort((a,b)=>a-b); if(A200[s]) return A200[s]; let lo=ks.filter(k=>k<s).pop(), hi=ks.find(k=>k>s); if(!lo) return s*2; if(!hi) return s; return A200[lo]+(A200[hi]-A200[lo])*(s-lo)/(hi-lo); };
const rows=PARAMS.PLATFORM==='ios'?IOS:ANDROID;
const modes=PARAMS.PLATFORM==='ios'?['Default (Large)','xxxLarge','AX5']:['100%','200%'];
let col=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name===PARAMS.COLLECTION);
if(!col){ col=figma.variables.createVariableCollection(PARAMS.COLLECTION); col.renameMode(col.modes[0].modeId,modes[0]); }
for(const m of modes) if(!col.modes.find(x=>x.name===m)) col.addMode(m);
const mid=Object.fromEntries(col.modes.map(m=>[m.name,m.modeId]));
const vars=await Promise.all(col.variableIds.map(id=>figma.variables.getVariableByIdAsync(id)));
const num=(name)=>{ let v=vars.find(x=>x.name===name); if(!v){ v=figma.variables.createVariable(name,col,'FLOAT'); vars.push(v);} v.scopes=name.endsWith('size')?['FONT_SIZE']:['LINE_HEIGHT']; return v; };
for(const f of [PARAMS.TITLE_FONT,PARAMS.TITLE_EMPH,PARAMS.BODY_FONT,PARAMS.BODY_EMPH]) await figma.loadFontAsync(f);
const styles=await figma.getLocalTextStylesAsync(); const out=[];
for(const [role,size,lh,kind,emph] of rows){
  const vs=num(role+'/size'), vl=num(role+'/line-height');
  vs.setValueForMode(mid[modes[0]],size); vl.setValueForMode(mid[modes[0]],lh);
  if(PARAMS.PLATFORM==='ios'){ vs.setValueForMode(mid['xxxLarge'],IOS_XXXL[role][0]); vl.setValueForMode(mid['xxxLarge'],IOS_XXXL[role][1]); vs.setValueForMode(mid['AX5'],IOS_AX5[role][0]); vl.setValueForMode(mid['AX5'],IOS_AX5[role][1]); }
  else { const s2=Math.round(lerp(size)); vs.setValueForMode(mid['200%'],s2); vl.setValueForMode(mid['200%'],Math.round(s2*lh/size)); }
  const name=PARAMS.PREFIX+'/'+role; let st=styles.find(s=>s.name===name); if(!st){ st=figma.createTextStyle(); st.name=name; }
  st.fontName=kind==='title'?(emph?PARAMS.TITLE_EMPH:PARAMS.TITLE_FONT):(emph?PARAMS.BODY_EMPH:PARAMS.BODY_FONT);
  st.fontSize=size; st.lineHeight={unit:'PIXELS',value:lh};
  st.setBoundVariable('fontSize',vs); st.setBoundVariable('lineHeight',vl); out.push(name); }
return {collection:col.id, modes, styles:out.length};
