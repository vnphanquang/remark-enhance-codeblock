import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { BrowserCommand } from 'vitest/node';

const emulateMedia: BrowserCommand<
	[mediaOptions: { colorScheme?: 'light' | 'dark'; reducedMotion?: 'reduce' | 'no-preference' }]
> = async ({ page, provider }, mediaOptions) => {
	// Ensure the provider is Playwright
	if (provider.name !== 'playwright') {
		throw new Error(
			`Provider ${provider.name} does not support emulateMedia. Use playwright instead.`,
		);
	}

	// Call the server-side Playwright Page instance
	await page.emulateMedia(mediaOptions);
};

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			exclude: ['tests/**/*', '**/*.css'],
		},
		projects: [
			{
				test: {
					include: ['tests/**/*.unit.test.ts'],
					name: 'unit',
					environment: 'node',
				},
			},
			{
				test: {
					include: ['tests/**/*.browser.test.ts'],
					name: 'browser',
					browser: {
						enabled: true,
						provider: playwright({
							contextOptions: {
								permissions: ['clipboard-read', 'clipboard-write'],
							},
						}),
						instances: [{ browser: 'chromium' }],
						commands: { emulateMedia },
					},
				},
			},
			{
				test: {
					include: ['tests/**/*.visual.test.ts'],
					name: 'visual',
					browser: {
						enabled: true,
						provider: playwright(),
						headless: true,
						instances: [
							{
								browser: 'chromium',
								headless: true,
								viewport: { width: 800, height: 600 },
							},
						],
					},
				},
			},
		],
	},
});
