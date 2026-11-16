#!/usr/bin/env node
// Checks CarPlay flows against the template-stack depth limit of the app's category (CarPlay Developer Guide, 2026-10-13).
// Usage: node carplay-depth.mjs flows.json [iosMinor]
// flows.json = {category:'driving-task', flows:[{name, steps:[{template:'List', change:'push'|'pop'|'refresh'|'modal'|'root'}]}]}
// Depth counts the root template. push +1 · pop −1 · refresh 0 · modal (Alert, Action sheet, Voice control overlay) 0 · root = new root (depth 1).
import fs from 'node:fs';
const spec=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const ios=parseFloat(process.argv[3]||'26.4');
const LIMIT={ 'audio':5,'communication':5,'ev-charging':5,'parking':5,'public-safety':5,'navigation':5,
  'fueling':3,'voice':3,'driving-task':ios>=26.4?3:2,'quick-food':ios>=26.4?3:2,'video':5 };
const ALLOWED={ Map:['navigation'], NowPlaying:['audio','video'], Contact:['communication'],
  PointOfInterest:['ev-charging','parking','fueling','quick-food','driving-task'], Information:['ev-charging','parking','fueling','quick-food','driving-task','public-safety'] };
const cat=spec.category, max=LIMIT[cat];
if(!max){ console.log(JSON.stringify({error:'unknown category '+cat, known:Object.keys(LIMIT)})); process.exit(1); }
for(const f of spec.flows){ let d=0, peak=0; const notes=[], trace=[];
  for(const s of f.steps){ const c=s.change||'push';
    if(c==='root') d=1; else if(c==='push') d++; else if(c==='pop') d=Math.max(1,d-1);
    if(ALLOWED[s.template]&&!ALLOWED[s.template].includes(cat)) notes.push(s.template+' is not available to '+cat+' (check the guide table)');
    if(s.template==='Grid'&&s.items>8) notes.push('Grid has '+s.items+' items (max 8)');
    if(s.template==='List'&&s.items>12) notes.push('List has '+s.items+' items — some cars cap at 12');
    peak=Math.max(peak,d); trace.push(s.template+'('+c+')='+d); }
  if(peak>max) notes.push('DEPTH '+peak+' > '+max+' for '+cat+' — the system refuses the push');
  else if(peak>3) notes.push('depth '+peak+': allowed, but keep common tasks to 2–3 levels');
  console.log(JSON.stringify({flow:f.name,category:cat,limit:max,peak,trace,notes})); }
