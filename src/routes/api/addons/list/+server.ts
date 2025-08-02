// src/routes/api/plugins/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import {
  PLUGIN_REGISTRY,
  type PluginName
} from '$lib/addons/registry.server';

// Force TS to see each entry as a [PluginName, Plugin] tuple
type RegistryEntry = [
  PluginName,
  typeof PLUGIN_REGISTRY[PluginName]
];

export const GET: RequestHandler = () => {
  const entries = Object.entries(PLUGIN_REGISTRY) as RegistryEntry[];

  
  const meta = Object.fromEntries(
    entries.map(([key, plugin]) => {
      return [
        key,
        {
          name:          plugin.name,
          name_friendly: plugin.name_friendly,
          version:       plugin.version,
          auth_fields:    plugin.auth_fields,
        }
      ];
    })
  );

  return new Response(JSON.stringify(meta), {
    headers: { 'content-type': 'application/json' }
  });
};

