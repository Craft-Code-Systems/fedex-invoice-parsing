// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default {
  plugins: [
    tailwindcss(),  // ← registers sm:, md:, etc. *first*
    sveltekit()
  ]
};
