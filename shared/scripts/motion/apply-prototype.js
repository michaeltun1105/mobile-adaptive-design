// use_figma. Wires prototype links between screens with M3 motion (Smart Animate / dissolve / move-in + spring),
// and writes a motion annotation on each source frame for developer handoff.
// The spring table is Material's own (androidx Compose MotionTokens, verified 2026-11-02) — not product values.
// The scheme comes from the saved system (system.motion.scheme); never pick per screen.
const PARAMS={
  SCHEME:'expressive',              // from load-system.js → system.motion.scheme ('expressive' | 'standard')
  LINKS:[ // one per interaction; pattern decides transition + spring
    // {from:'<node id of the tapped element or frame>', to:'<destination frame id>', pattern:'container-transform'|'forward'|'back'|'top-level'|'lateral'|'enter-exit-overlay'|'press', speed:'fast'|'default'|'slow' (optional), trigger:'ON_CLICK'}
  ],
  ANNOTATE:true };
// stiffness + damping RATIO per Material token
const M3={ expressive:{ spatial:{fast:[800,0.6],default:[380,0.8],slow:[200,0.8]}, effects:{fast:[3800,1],default:[1600,1],slow:[800,1]} },
           standard:  { spatial:{fast:[1400,0.9],default:[700,0.9],slow:[300,0.9]}, effects:{fast:[3800,1],default:[1600,1],slow:[800,1]} } };
// Figma spring = mass, stiffness, damping COEFFICIENT → c = 2·ζ·√(k·m), m = 1
const spring=(kind,speed)=>{ const [k,z]=M3[PARAMS.SCHEME][kind][speed]; return {type:'CUSTOM_SPRING', easingFunctionSpring:{mass:1, stiffness:k, damping:+(2*z*Math.sqrt(k)).toFixed(1), initialVelocity:0}}; };
// pattern → transition (M3 Transitions page) + token
const PAT={
  'container-transform':{t:(e)=>({type:'SMART_ANIMATE',easing:e,duration:0.5}), kind:'spatial', speed:'default', note:'Container transform (hero) — card/FAB/list item expands into the destination'},
  'forward':            {t:(e)=>({type:'MOVE_IN',direction:'LEFT',matchLayers:false,easing:e,duration:0.5}), kind:'spatial', speed:'default', note:'Forward (Android platform default: slide + fade)'},
  'back':               {t:(e)=>({type:'MOVE_OUT',direction:'RIGHT',matchLayers:false,easing:e,duration:0.5}), kind:'spatial', speed:'default', note:'Backward (platform default)', back:true},
  'top-level':          {t:(e)=>({type:'DISSOLVE',easing:e,duration:0.3}), kind:'effects', speed:'default', note:'Top level (nav bar / rail): fade out → fade in, no slide'},
  'lateral':            {t:(e)=>({type:'PUSH',direction:'LEFT',matchLayers:true,easing:e,duration:0.5}), kind:'spatial', speed:'default', note:'Lateral (peer tabs/carousel): slide in unison, no fade'},
  'enter-exit-overlay': {t:(e)=>({type:'SMART_ANIMATE',easing:e,duration:0.5}), kind:'spatial', speed:'default', note:'Enter/exit: sheet, menu, dialog expands from its edge (no scale/z)', overlay:true},
  'press':              {t:(e)=>({type:'SMART_ANIMATE',easing:e,duration:0.35}), kind:'spatial', speed:'fast', note:'Press/select state (button, switch, chip) — shape morph'} };
const out=[], warn=[];
for(const L of PARAMS.LINKS){ const P=PAT[L.pattern]; if(!P){ warn.push('unknown pattern '+L.pattern); continue; }
  const src=await figma.getNodeByIdAsync(L.from); const dst=await figma.getNodeByIdAsync(L.to); if(!src||!dst){ warn.push('missing node '+(src?L.to:L.from)); continue; }
  const speed=L.speed||P.speed; const e=spring(P.kind,speed);
  const action=P.back?{type:'BACK'}:{type:'NODE',destinationId:dst.id,navigation:P.overlay?'OVERLAY':'NAVIGATE',transition:P.t(e),resetScrollPosition:false};
  const other=(src.reactions||[]).filter(r=>!(r.trigger&&r.trigger.type===(L.trigger||'ON_CLICK')));
  await src.setReactionsAsync([...other,{trigger:{type:L.trigger||'ON_CLICK'},actions:[action]}]);
  const token='md.sys.motion.spring.'+speed+'.'+P.kind+' · scheme '+PARAMS.SCHEME;
  if(PARAMS.ANNOTATE && 'annotations' in src){ const label='Motion: '+P.note+'\nToken: '+token+'\nReduce motion: fade only (no slide, parallax or shape morph).';
    try{ src.annotations=[...(src.annotations||[]).filter(a=>!(a.label||'').startsWith('Motion:')),{label}]; }catch(err){ warn.push('annotation skipped on '+src.id+' ('+err.message+') — annotate the parent frame'); } }
  out.push({from:src.id,to:dst.id,pattern:L.pattern,token,figmaSpring:e.easingFunctionSpring}); }
return {linked:out, warnings:warn};
