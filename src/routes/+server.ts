import type { RequestHandler } from '@sveltejs/kit';
import { getPlugin, type PluginName, type PluginIFE } from '$lib/addons/registry';

export const POST: RequestHandler = async ({ request }) => {
  // 1) Parse which plugin and its auth from the request body
  const { plugin: name, auth } = await request.json() as { plugin: string; auth: unknown };

  // 2) Narrow it to our known union
  const pluginName = name as PluginName;

  // 3) Grab its build-time addon instance and init it
  const api = getPlugin(pluginName).init();

  // 4) Now TS knows `api.getCookie`’s parameter type, so you can either:
  //
  //    a) Rely on inference:
        // const result = await api.getCookie(auth);
  //
  //    b) Or use TS 4.9’s `satisfies` to check your payload:
        // const fedexAuth = {
        //   api_client_id: process.env.FEDEX_CLIENT_API_ID!,
        //   /* …etc… */
        // } satisfies Parameters<typeof api.getCookie>[0];
        // const result = await api.getCookie(fedexAuth);
  //
  //    c) Or cast explicitly:
  //       const fedexAuth = auth as Parameters<typeof api.getCookie>[0];
  //       const result = await api.getCookie(fedexAuth);

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
