#!/usr/bin/env python3
"""Material Symbol SVG → absolute 24-dp path + checksum.
Usage: pip install --break-system-packages svgelements
       python3 svg-to-24.py path/to/outlined/<name>.svg [more.svg …]
Prints JSON {name:{d,len,sum}}. In use_figma, recompute len and sum (sum of char codes)
and abort if they differ — long paths get corrupted when retyped."""
import sys, re, json, os
from svgelements import Path, Matrix, Move, Line, CubicBezier, QuadraticBezier, Close
f=lambda v:('%.2f'%v).rstrip('0').rstrip('.')
out={}
for fn in sys.argv[1:]:
    d=re.search(r' d="([^"]+)"',open(fn).read()).group(1)
    p=(Path(d)*Matrix("scale(0.025) translate(0,960)")).reify(); seg=[]
    for s in p:
        if isinstance(s,Move): seg.append(f"M{f(s.end.x)} {f(s.end.y)}")
        elif isinstance(s,Close): seg.append("Z")
        elif isinstance(s,Line): seg.append(f"L{f(s.end.x)} {f(s.end.y)}")
        elif isinstance(s,QuadraticBezier): seg.append(f"Q{f(s.control.x)} {f(s.control.y)} {f(s.end.x)} {f(s.end.y)}")
        elif isinstance(s,CubicBezier): seg.append(f"C{f(s.control1.x)} {f(s.control1.y)} {f(s.control2.x)} {f(s.control2.y)} {f(s.end.x)} {f(s.end.y)}")
    v="".join(seg); out[os.path.basename(fn)[:-4]]={"d":v,"len":len(v),"sum":sum(map(ord,v))}
print(json.dumps(out,separators=(',',':')))
