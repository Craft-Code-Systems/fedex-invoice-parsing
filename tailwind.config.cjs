// tailwind.config.cjs
const forms      = require('@tailwindcss/forms');
const typography = require('@tailwindcss/typography');
const { skeleton } = require('@skeletonlabs/tw-plugin');
import { customtheme } from './src/customtheme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@skeletonlabs/skeleton-svelte/dist/**/*.{js,svelte}'
  ],
  theme: { extend: {} },
  plugins: [
    forms,
    typography,
    // ← injects all of Skeleton’s base/components/utilities + variants
    skeleton({
      themes: {
        custom: [customtheme]
      }
    })
  ]
};
