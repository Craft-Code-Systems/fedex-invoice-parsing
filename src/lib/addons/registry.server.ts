// registry.server.ts
import moneybirdWebAddon, {type ife as IFEmoneybirdWebAddon} from 'ccs-moneybird-api-addon';
// import loggingAddon, {type ife as IFEloggingAddon} from 'ccs-logging-addon';
// import loggingAddon from 'ccs-logging-addon';
// …other imports…

export const PLUGIN_REGISTRY = {
  'moneybird-api': moneybirdWebAddon,
  // 'logging': loggingAddon

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
      'moneybird-api': typeof IFEmoneybirdWebAddon,
      // 'logging': typeof IFEloggingAddon
      // 'postnl':   typeof PostnlTypes;
    };

