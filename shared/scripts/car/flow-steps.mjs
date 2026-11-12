#!/usr/bin/env node
// Counts Android for Cars task-flow steps from a simple spec and flags rule breaks.
// Usage: node flow-steps.mjs flows.json   (flows.json = [{name, steps:[{template:'List', change:'new'|'refresh'|'back'|'parked'|'phone'|'other-app'}]}])
// Rules (UX requirements, read 2026-11-12): new template or new content = +1; refresh = 0; back with same content = -1;
// parked-only templates (Sign-in, Long Message) and steps on the phone don't add; opening another app / landing template = new task.
// MUST ≤ 5 (unless Adaptive task limits); 5th step must not be List/Grid/Sectioned; no 5 list/grid in a row. SHOULD ≤ 3 (≤ 4 with purchase).
import fs from 'node:fs';
const flows=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const LISTY=/^(List|Grid|Sectioned|Search|PlaceList)/i;
for(const f of flows){ let n=0, run=0; const notes=[], trace=[];
  for(const s of f.steps){ const c=s.change||'new';
    if(c==='new') n++; else if(c==='back') n=Math.max(1,n-1); else if(c==='other-app'||c==='landing'){ trace.push(s.template+'→new task'); n=0; run=0; continue; }
    run = LISTY.test(s.template)&&c==='new' ? run+1 : (c==='new'?0:run);
    if(run>=5) notes.push('5 list/grid templates in a row');
    if(n===5&&LISTY.test(s.template)) notes.push('step 5 is '+s.template+' (must be Navigation, Message or Pane)');
    trace.push(s.template+'('+c+')='+n); }
  const max=Math.max(0,...trace.map(t=>+t.split('=')[1]||0));
  if(max>5) notes.push('MORE THAN 5 STEPS ('+max+') — app crashes unless Adaptive task limits is enabled');
  else if(max>(f.purchase?4:3)) notes.push('longer than recommended ('+max+' > '+(f.purchase?4:3)+'): add shortcuts');
  console.log(JSON.stringify({flow:f.name,maxSteps:max,trace,notes})); }
