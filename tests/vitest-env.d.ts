import 'vitest/browser';

declare module 'vitest/browser' {
	interface BrowserCommands {
		emulateMedia: (mediaOptions: {
			colorScheme?: 'light' | 'dark';
			reducedMotion?: 'reduce' | 'no-preference';
		}) => Promise<void>;
	}
}
