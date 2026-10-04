import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    // Copies volontaires de l'état initial (file de révision, réponses du QCM)
    warningFilter: (w) => w.code !== 'state_referenced_locally'
  },
  kit: {
    adapter: adapter({ out: 'build' }),
    // Formulaires depuis le réseau local (http://IP-du-LXC:3000)
    csrf: { trustedOrigins: ['*'] }
  }
};
