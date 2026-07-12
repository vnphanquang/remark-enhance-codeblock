import devServer from '@hono/vite-dev-server';
import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
	plugins: [
		devServer({
			entry: 'playground/index.ts',
		}),
		qrcode(),
	],
});
