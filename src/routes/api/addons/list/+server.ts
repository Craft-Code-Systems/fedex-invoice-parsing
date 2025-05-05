// src/routes/api/plugins/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import {
  PLUGIN_REGISTRY,
  type PluginName,
  type PluginIFE
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
      // Build your static template and cast it to the exact IFE['auth'] type:
      const authTemplate = {
        api_bearer_token: '',
        web_bearer_token: '',
        api_client_id: '',
        api_client_secret: '',
        web_client_id: '',
        web_client_username: '',
        web_client_password: '',
        web_client_cookie: '',
        web_account_number: '',
        web_transaction_id: '',
        api_bearer_token_expires_at: 0
      } as PluginIFE[key]['auth'];

      return [
        key,
        {
          name:          plugin.name,
          name_friendly: plugin.name_friendly,
          version:       plugin.version,
          authFields:    Object.keys(authTemplate)   // now TS knows this matches PluginIFE[key]['auth']
        }
      ];
    })
  );

  return new Response(JSON.stringify(meta), {
    headers: { 'content-type': 'application/json' }
  });
};

