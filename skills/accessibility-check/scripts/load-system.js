// use_figma (read-only). Returns the design system saved by design-system-setup, or null.
// Also lists what exists in the file so a missing system can be rebuilt from it.
const raw=figma.root.getSharedPluginData('mobile_adaptive','system')||figma.root.getSharedPluginData('android_adaptive','system');
const system=raw?JSON.parse(raw):null;
const cols=(await figma.variables.getLocalVariableCollectionsAsync()).map(c=>({id:c.id,name:c.name,modes:c.modes.map(m=>m.name),vars:c.variableIds.length}));
const styles=(await figma.getLocalTextStylesAsync()).map(s=>s.name);
const prefixes=[...new Set(styles.map(n=>n.split('/').slice(0,-1).join('/')))].slice(0,20);
return {system, collections:cols, textStylePrefixes:prefixes};
