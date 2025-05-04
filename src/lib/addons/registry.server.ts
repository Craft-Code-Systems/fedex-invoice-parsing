// registry.server.ts
import fedexWebAddon, {type ife as IFEfedexWebAddon } from 'ccs-fedex-web-addon';
// …other imports…

export const PLUGIN_REGISTRY = {
  'fedex-web': fedexWebAddon,
  // …
} as const;




export type PluginName = keyof typeof PLUGIN_REGISTRY;

export function getPlugin<Name extends PluginName>(name: Name) {
  const plugin = PLUGIN_REGISTRY[name];
  if (!plugin) throw new Error(`Plugin "${name}" does not exist.`);
  return plugin;
}

// List of plugins
export function listPlugins(): PluginName[] {
  return Object.keys(PLUGIN_REGISTRY) as PluginName[];
}

export type PluginIFE = {
      'fedex-web': typeof IFEfedexWebAddon;
      // 'postnl':   typeof PostnlTypes;
    };

