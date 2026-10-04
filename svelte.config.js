import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ out: 'build' }),
    // Formulaires depuis le réseau local (http://IP-du-LXC:3000)
    csrf: { trustedOrigins: ['*'] }
  }
};
