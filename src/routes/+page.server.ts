// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('/api/addons');
  if (!res.ok) {
    throw new Error('Failed to load plugin metadata');
  }
  const plugins = await res.json();
  return { plugins };
};
