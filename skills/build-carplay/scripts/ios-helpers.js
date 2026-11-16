// iOS-only helpers. iOS system bars come from the team's/Apple's kit used in the file — pass the component (or a node to clone);
// nothing product-specific is hard-coded here.
async function addIosSystemBars(frame,{statusBar,homeIndicator}){ // statusBar/homeIndicator: ComponentNode or SceneNode to clone
  const mk=n=>n.type==='COMPONENT'?n.createInstance():n.clone(); const W=frame.width,H=frame.height; const out={};
  if(statusBar){ const s=mk(statusBar); frame.appendChild(s); if(frame.layoutMode&&frame.layoutMode!=='NONE') s.layoutPositioning='ABSOLUTE'; s.resize(W,s.height); s.x=0; s.y=0; s.constraints={horizontal:'STRETCH',vertical:'MIN'}; out.statusBar=s; }
  if(homeIndicator){ const h=mk(homeIndicator); frame.appendChild(h); if(frame.layoutMode&&frame.layoutMode!=='NONE') h.layoutPositioning='ABSOLUTE'; h.resize(W,h.height); h.x=0; h.y=H-h.height; h.constraints={horizontal:'STRETCH',vertical:'MAX'}; out.homeIndicator=h; }
  return out; }
