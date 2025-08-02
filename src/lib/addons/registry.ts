
// import fedexWebAddon, { type ife as IFEfedexWebAddon } from 'ccs-fedex-web-addon';
// // import postnlAddon from '@craftcode/plugin-postnl'; // next one in


// export const PLUGIN_REGISTRY = {
//   'fedex-web': fedexWebAddon,
//   // 'postnl': postnlAddon,
// } as const;


// export type PluginName = keyof typeof PLUGIN_REGISTRY;
// // => "fedex-web" | "postnl"


// export function getPlugin<Name extends PluginName>(name: Name) {
//   const plugin = PLUGIN_REGISTRY[name];
//   if (!plugin) throw new Error(`Plugin "${name}" does not exist.`);
//   return plugin;
// }

// export function getPluginInfo<Name extends PluginName>(name: Name) {
//   const plugin = PLUGIN_REGISTRY;
//   const pluginInfo = {name: PLUGIN_REGISTRY[name].name, name_friendly: PLUGIN_REGISTRY[name].name_friendly, version: PLUGIN_REGISTRY[name].version};
//   if (!pluginInfo) throw new Error(`Plugin "${name}" does not exist.`);
//   return pluginInfo;
// }


// export function listPlugins(): PluginName[] {
//   return Object.keys(PLUGIN_REGISTRY) as PluginName[];
// }


// export type PluginIFE = {
//   'fedex-web': typeof IFEfedexWebAddon;
//   // 'postnl':   typeof PostnlTypes;
// };