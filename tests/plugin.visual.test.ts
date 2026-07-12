import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';

import style from '../src/styles/all.css?url';

import { html, markdown } from './test-utils';
import { setupPage } from './test-utils.browser';

beforeAll(async () => {
	// load the preset CSS and some defaults
	// for consistent rendering across browsers and platforms
	document.head.insertAdjacentHTML(
		'beforeend',
		html`
			<link rel="stylesheet" href="${style}" />
			<style>
				:root {
					color-scheme: light dark;
					background-color: light-dark(white, black);
					color: light-dark(black, white);
				}

				main {
					max-width: 80ch;
					padding: 1rem;
					margin-inline: auto;
				}
			</style>
		`,
	);
});
afterAll(() => {
	document.head.querySelectorAll('link[rel="stylesheet"]').forEach((link) => link.remove());
	document.head.querySelectorAll('style').forEach((style) => style.remove());
});

afterEach(async () => {
	document.body.innerHTML = '';
});

const examples = import.meta.glob('./fixtures/examples/*.md', {
	eager: true,
	query: '?raw',
	import: 'default',
});

describe('typical use cases (examples)', () => {
	for (const [path, md] of Object.entries(examples)) {
		const filename = path.split('/').pop()!;
		test(filename, async () => {
			const main = await setupPage(md);
			await expect(page.elementLocator(main)).toMatchScreenshot(filename.slice(0, -3));
		});
	}
});

const perSyntax = import.meta.glob('./fixtures/per-syntax/code.*', {
	eager: true,
	query: '?raw',
	import: 'default',
});

describe('default file icon', () => {
	for (const [path, source] of Object.entries(perSyntax)) {
		const lang = path
			.split('/')
			.pop()!
			.slice('code'.length + 1);
		test(lang, async () => {
			const md = markdown`
				~~~${lang} #title="${lang}"
				${source}
				~~~
			`;
			const main = await setupPage(md);
			const i: HTMLElement = main.querySelector('.codeblock-title i')!;
			const locator = page.elementLocator(i);

			await expect.element(locator).toHaveClass(`i i-file i-file-${lang}`);

			i.style.width = '100px';
			i.style.height = '100px';

			await expect.element(locator).toMatchScreenshot(`file-icon-${lang}`);
		});
	}
});
