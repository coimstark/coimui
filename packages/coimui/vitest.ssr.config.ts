import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tailwindcss(), svelte({ preprocess: vitePreprocess() })],
	test: {
		environment: 'node',
		globals: true,
		include: ['src/**/*.ssr.test.ts']
	}
});
