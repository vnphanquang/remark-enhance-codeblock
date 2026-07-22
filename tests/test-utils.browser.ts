import { expect } from 'vitest';
import { page } from 'vitest/browser';

import { enhanceCodeblock } from '../src/client';

import { processWithPlugin } from './test-utils';

export async function setupPage(md: string, options: Parameters<typeof enhanceCodeblock>[0] = {}) {
	const output = await processWithPlugin(md);
	const main = document.createElement('main');
	main.innerHTML = output;
	document.body.appendChild(main);
	enhanceCodeblock(options);
	await expect.element(page.elementLocator(main.firstElementChild!)).toHaveClass('enhanced');
	return main;
}
