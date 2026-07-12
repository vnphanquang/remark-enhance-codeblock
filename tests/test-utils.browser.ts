import { expect } from 'vitest';
import { page } from 'vitest/browser';

import { enhanceCodeblocks } from '../src/client';

import { processWithPlugin } from './test-utils';

export async function setupPage(md: string, options: Parameters<typeof enhanceCodeblocks>[0] = {}) {
	const output = await processWithPlugin(md);
	const main = document.createElement('main');
	main.innerHTML = output;
	document.body.appendChild(main);
	enhanceCodeblocks(options);
	await expect.element(page.elementLocator(main.firstElementChild!)).toHaveClass('enhanced');
	return main;
}
