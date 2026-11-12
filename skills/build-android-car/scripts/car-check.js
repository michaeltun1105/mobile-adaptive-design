// use_figma, read-only. Checks built car screens against Android for Cars limits the kit can't enforce.
// PARAMS.SCREENS: [{id:'<screen frame id>', template:'Pane'|'Message'|'LongMessage'|'List'|'Grid'|'Tab'|'Search'|'SignIn'|'Map'|'Navigation'|'Sectioned', parkedOnly:false}]
const PARAMS={ SCREENS:[], MAX_CHARS:120, MAX_LINE_CHARS:80 };
const res=[];
for(const S of PARAMS.SCREENS){ const f=await figma.getNodeByIdAsync(S.id); if(!f){ res.push({id:S.id,error:'missing'}); continue; }
  const issues=[];
  const texts=f.findAll(n=>n.type==='TEXT'&&n.visible);
  for(const t of texts){ const s=t.characters.trim(); if(!s||/^[a-z_]+$/.test(s)&&t.fontName&&/Material Icons/.test(t.fontName.family)) continue;
    if(!S.parkedOnly&&s.length>PARAMS.MAX_CHARS) issues.push('text >120 chars ('+s.length+'): "'+s.slice(0,40)+'…"');
    if(/lorem|placeholder|primary text|secondary text|title|label/i.test(s)&&s.length<25) issues.push('placeholder text left: "'+s+'"'); }
  const btns=f.findAll(n=>n.type==='INSTANCE'&&/button/i.test(n.name)&&n.visible).length;
  if(['Pane','Message','LongMessage'].includes(S.template)&&btns>2) issues.push('more than 2 buttons in '+S.template+' ('+btns+')');
  if(S.template==='Tab'){ const tabs=f.findAll(n=>/^tab/i.test(n.name)&&n.type==='INSTANCE'&&n.visible).length; if(tabs&&(tabs<2||tabs>4)) issues.push('Tab template needs 2–4 tabs ('+tabs+')'); }
  if(S.template==='Pane'){ const rows=f.findAll(n=>/row/i.test(n.name)&&n.type==='INSTANCE'&&n.visible).length; if(rows>4) issues.push('Pane: more than 4 rows ('+rows+')'); }
  res.push({id:f.id,name:f.name,template:S.template,issues}); }
return res;
