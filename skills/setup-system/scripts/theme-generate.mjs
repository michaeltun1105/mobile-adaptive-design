// Usage (workspace): npm i @material/material-color-utilities@0.3.0
//   node theme-generate.mjs "#0096D6" [tonal|fidelity] [--override-light-primary]
// Prints JSON { source, variant, brandTone, accessibleTone, roles:[49 names], Light:[hex…], Dark:[hex…], overrides:{} }
// Paste the JSON into PARAMS.THEME of scripts/figma/apply-theme.js.
import {argbFromHex,hexFromArgb,Hct,SchemeTonalSpot,SchemeFidelity,MaterialDynamicColors,Contrast} from '@material/material-color-utilities';
const ROLES=["Primary","Surface Tint","On Primary","Primary Container","On Primary Container","Secondary","On Secondary","Secondary Container","On Secondary Container","Tertiary","On Tertiary","Tertiary Container","On Tertiary Container","Error","On Error","Error Container","On Error Container","Background","On Background","Surface","On Surface","Surface Variant","On Surface Variant","Outline","Outline Variant","Shadow","Scrim","Inverse Surface","Inverse On Surface","Inverse Primary","Primary Fixed","On Primary Fixed","Primary Fixed Dim","On Primary Fixed Variant","Secondary Fixed","On Secondary Fixed","Secondary Fixed Dim","On Secondary Fixed Variant","Tertiary Fixed","On Tertiary Fixed","Tertiary Fixed Dim","On Tertiary Fixed Variant","Surface Dim","Surface Bright","Surface Container Lowest","Surface Container Low","Surface Container","Surface Container High","Surface Container Highest"];
const key=n=>n.split(' ').map((w,i)=>i?w[0].toUpperCase()+w.slice(1).toLowerCase():w.toLowerCase()).join('');
const [,,hex='#6750A4',variant='tonal',...flags]=process.argv;
const src=Hct.fromInt(argbFromHex(hex)); const S=variant==='fidelity'?SchemeFidelity:SchemeTonalSpot;
const out={source:hex.toUpperCase(),variant:variant==='fidelity'?'Fidelity':'Tonal Spot',library:'@material/material-color-utilities@0.3.0',roles:ROLES,overrides:{}};
for(const [mode,dark] of [['Light',false],['Dark',true]]){ const s=new S(src,dark,0); out[mode]=ROLES.map(r=>hexFromArgb(MaterialDynamicColors[key(r)].getArgb(s))); }
out.brandTone=+src.tone.toFixed(1); out.brandOnWhite=+Contrast.ratioOfTones(100,src.tone).toFixed(2);
for(let t=Math.min(src.tone,60);t>=20;t-=0.5){ if(Contrast.ratioOfTones(100,t)>=4.5){ out.accessibleTone=t; out.accessibleHex=hexFromArgb(Hct.from(src.hue,src.chroma,t).toInt()); break; } }
if(flags.includes('--override-light-primary')){ out.overrides={'Light/Primary':hex,'Light/Surface Tint':hex}; out.primaryTextLight=out.Light[0]; out.primaryTextDark=out.Dark[0]; out.Light[0]=hex; out.Light[1]=hex; }
console.log(JSON.stringify(out));
