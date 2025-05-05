// src/routes/api/plugins/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { sessionStore } from '$lib/server/store';
import {
  getPlugin,
  type PluginName
} from '$lib/addons/registry.server';

export const GET: RequestHandler = async () => {
  // 1) Grab all of your sessions from the in-memory store
  const sessions = Array.from(sessionStore.values());

  // 2) For each session, if it's fedex-web, call the async helper
  for (const session of sessions) {
    if (session.pluginName === 'fedex-web') {
      // session.auth is whatever shape you stored earlier
      const fedexAuthResult = await fedexAuth(session.pluginName, session.auth);

      // 3) Stash the new cookie back on your session object
      session.auth.web_client_cookie = fedexAuthResult.web_client_cookie;
      const fedexListDocumentsResult = await fedexListDocuments(session.pluginName, session.auth);
      console.log("fedexListDocumentsResult: ", fedexListDocumentsResult);
    }
  }

  // 4) Return whatever makes sense — here I’ll return the updated sessions
  return new Response(
    JSON.stringify({ success: true, sessions }),
    { headers: { 'content-type': 'application/json' } }
  );
};


/**  
 * Initialize the plugin’s API and pull its cookie.  
 * @param name    The plugin key  
 * @param auth    The auth-template / filled-in auth object  
 */
async function fedexAuth(
  name: PluginName,
  auth: Record<string, unknown>
): Promise<Record<string, any>> {
  // 1) Narrow down the plugin
  const api = getPlugin(name).init();

  // 2) Call the async getCookie method, passing in the auth object
  const result = await api.getCookie(auth as Parameters<typeof api.getCookie>[0]);

  // 3) Return whatever the plugin gives you
  return result;
}


async function fedexListDocuments(
    name: PluginName,
    auth: Record<string, unknown>
  ): Promise<Record<string, any>> {
    // 1) Narrow down the plugin
    const api = getPlugin(name).init();
  
    // 2) Call the async getCookie method, passing in the auth object
    const result = await api.getFileList(auth as Parameters<typeof api.getFileList>[0]);
  
    // 3) Return whatever the plugin gives you
    return result;
  }
  