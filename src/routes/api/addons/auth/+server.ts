// src/routes/api/plugins/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { sessionStore } from '$lib/server/store'
import {
  type PluginName,
} from '$lib/addons/registry.server';



export const GET: RequestHandler = async ({ url }) => {
  const sessionId = url.searchParams.get('sessionId');
  const data = sessionId ? sessionStore.get(sessionId) : null;
  return new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' }
  });
};


export const POST: RequestHandler = async ({ request }) => {

    const { plugin: name, auth, sessionId } = await request.json() as { plugin: string; auth: unknown };
  
    const pluginName = name as PluginName;
  
    sessionStore.set(sessionId, {pluginName, auth});
  
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' }
      }
    );
  };
  

// export const POST: RequestHandler = async ({ request }) => {

//   const { plugin: name, auth } = await request.json() as { plugin: string; auth: unknown };

//   const pluginName = name as PluginName;

//   const api = getPlugin(pluginName).init();


//   const result = await api.getCookie(auth as Parameters<typeof api.getCookie>[0]);
//   const typedAuth = auth as PluginIFE[typeof pluginName]['auth'];

//   return new Response(
//     JSON.stringify({ success: true, result }),
//     {
//       status: 200,
//       headers: { 'content-type': 'application/json' }
//     }
//   );
// };
