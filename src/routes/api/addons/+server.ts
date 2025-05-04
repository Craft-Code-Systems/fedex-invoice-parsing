// src/routes/api/plugins/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import {
  PLUGIN_REGISTRY,
  getPlugin,
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
        api_bearer_token_expires_at: 0
      } as PluginIFE[key]['auth'];

      return [
        key,
        {
          name:          plugin.name,
          name_friendly: plugin.name_friendly,
          version:       plugin.version,
          authFields:    authTemplate   // now TS knows this matches PluginIFE[key]['auth']
        }
      ];
    })
  );

  return new Response(JSON.stringify(meta), {
    headers: { 'content-type': 'application/json' }
  });
};


export const POST: RequestHandler = async ({ request }) => {

  const { plugin: name, auth } = await request.json() as { plugin: string; auth: unknown };

  const pluginName = name as PluginName;

  const api = getPlugin(pluginName).init();


  const result = await api.getCookie(auth as Parameters<typeof api.getCookie>[0]);
  const typedAuth = auth as PluginIFE[typeof pluginName]['auth'];

  return new Response(
    JSON.stringify({ success: true, result }),
    {
      status: 200,
      headers: { 'content-type': 'application/json' }
    }
  );
};
