import { afterAll, afterEach, assert, beforeAll, describe, expect, test, vi } from 'vitest';
import { commands, page, userEvent } from 'vitest/browser';

import { DEFAULT_OPTIONS } from '../src/internals/resolve-options.js';
import style from '../src/styles/all.css?url';

import example1 from './fixtures/examples/1-single-line-no-title.md?raw';
import example2 from './fixtures/examples/2-single-line-with-title.md?raw';
import example3 from './fixtures/examples/3-multiple-lines-no-title.md?raw';
import example4 from './fixtures/examples/4-multiple-lines-with-title.md?raw';
import example6 from './fixtures/examples/6-group-of-related-files.md?raw';
import example7 from './fixtures/examples/7-trim.md?raw';
import { assertIconByClassName, html, normaliseNewline } from './test-utils';
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

describe('hide fullscreen action for oneliner codeblock', () => {
	const cases = [
		{ name: 'no title', md: example1 },
		{ name: 'with title', md: example2 },
	] as const;
	for (const { name, md } of cases) {
		test(name, async () => {
			await setupPage(md);
			const locator = page.getByRole('button', {
				name: DEFAULT_OPTIONS.intl.fullscreen.open,
				includeHidden: true,
			});
			await expect.element(locator).not.toBeVisible();
		});
	}
});

describe('hide collapse action for standalone codeblock without title', () => {
	const cases = [
		{ name: 'single-line', md: example1 },
		{ name: 'multi-line', md: example3 },
	] as const;
	for (const { name, md } of cases) {
		test(name, async () => {
			await setupPage(md);
			const locator = page.getByRole('switch', {
				name: DEFAULT_OPTIONS.intl.collapse,
				includeHidden: true,
			});
			await expect.element(locator).not.toBeVisible();
		});
	}
});

describe('actions are only opaque on hover', () => {
	const cases = [
		{ name: 'single-line', md: example1 },
		{ name: 'multi-line', md: example3 },
	] as const;
	for (const { name, md } of cases) {
		test(name, async () => {
			const main = await setupPage(md);
			const codeblock = main.querySelector('.codeblock')!;
			const actions = codeblock.querySelector('.codeblock-actions')!;

			await expect.poll(() => getComputedStyle(actions).opacity).toBe('0');
			await page.elementLocator(codeblock).hover();
			await expect.poll(() => getComputedStyle(actions).opacity).toBe('1');
		});
	}
});

describe('lang is opaque until hover', () => {
	describe('standalone: transparent on block hover', () => {
		const cases = [
			{ name: 'standalone, no title', md: example3 },
			{ name: 'standalone, with title', md: example4 },
		] as const;
		for (const { name, md } of cases) {
			test(name, async () => {
				const main = await setupPage(md);
				const codeblock = main.querySelector('.codeblock')!;
				const lang = codeblock.querySelector('.codeblock-lang')!;

				await expect.poll(() => getComputedStyle(lang).opacity).toBe('1');

				await page.elementLocator(codeblock).hover();
				await expect.poll(() => getComputedStyle(lang).opacity).toBe('0');
				await expect.poll(() => getComputedStyle(lang).pointerEvents).toBe('none');
			});
		}
	});

	test('group: transparent only on content hover', async () => {
		const main = await setupPage(example6);
		const header = main.querySelector('.codeblock-header')!;
		const content = main.querySelector('.codeblock-content')!;
		const lang = content.querySelector('.codeblock-lang')!;

		await expect.poll(() => getComputedStyle(lang).opacity).toBe('1');

		await page.elementLocator(header).hover();
		await expect.poll(() => getComputedStyle(lang).opacity).toBe('1');

		await page.elementLocator(content).hover();
		await expect.poll(() => getComputedStyle(lang).opacity).toBe('0');
		await expect.poll(() => getComputedStyle(lang).pointerEvents).toBe('none');
	});
});

test('collapse functionaility should work', async () => {
	const main = await setupPage(example4);
	const collapseSwitch = page.getByRole('switch', { name: DEFAULT_OPTIONS.intl.collapse });
	const collapseLocator = page.getByLabelText(DEFAULT_OPTIONS.intl.collapse);
	await expect
		.poll(() => main.querySelector('.codeblock-content')?.clientHeight)
		.toBeGreaterThan(0);
	await expect.element(collapseSwitch).not.toBeChecked();

	await collapseLocator.click();
	await expect.poll(() => main.querySelector('.codeblock-content')?.clientHeight).toBe(0);
	await expect.element(collapseSwitch).toBeChecked();
});

describe('copy functionaility should work', async () => {
	test('standalone', async () => {
		const main = await setupPage(example1);
		const content = main.querySelector('pre')!.textContent!;

		await assertIconByClassName('codeblock-copy', DEFAULT_OPTIONS.iconClasses.copy.default);
		const actionCopyLocator = page.getByRole('button', { name: DEFAULT_OPTIONS.intl.copy.default });
		await actionCopyLocator.click();

		await assertIconByClassName('codeblock-copy', DEFAULT_OPTIONS.iconClasses.copy.copied);
		const actionCopiedLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.copy.copied,
		});
		await expect.element(actionCopiedLocator).toBeVisible();

		expect(normaliseNewline(await navigator.clipboard.readText()).replace(/\r\n|\r/g, '\n')).toBe(
			content,
		);
	});

	test('group', async () => {
		const main = await setupPage(example6);
		const actionCopyLocator = page.getByRole('button', { name: DEFAULT_OPTIONS.intl.copy.default });

		// try select then copy tab 2
		const tab2 = page.getByRole('tab').nth(1);
		await tab2.click();
		await actionCopyLocator.click();
		const contentTab2 = main.querySelector('.codeblock:nth-of-type(2) pre')!.textContent!;
		expect(normaliseNewline(await navigator.clipboard.readText())).toBe(contentTab2);

		// try select then copy tab 3
		const tab3 = page.getByRole('tab').nth(2);
		await tab3.click();
		const actionCopiedLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.copy.copied,
		});
		await actionCopiedLocator.click();
		const contentTab3 = main.querySelector('.codeblock:nth-of-type(3) pre')!.textContent!;
		expect(normaliseNewline(await navigator.clipboard.readText())).toBe(contentTab3);

		// try select back tab 2 then copy
		await tab2.click();
		await actionCopiedLocator.click();
		expect(normaliseNewline(await navigator.clipboard.readText())).toBe(contentTab2);

		// try copy again at tab 2
		await actionCopiedLocator.click();
		expect(normaliseNewline(await navigator.clipboard.readText())).toBe(contentTab2);
	});

	test('should revert to default state after specified time', async () => {
		await setupPage(example6, {
			copyTimeoutMs: 100, // set a short timeout for testing
		});
		const actionCopyLocator = page.getByRole('button', { name: DEFAULT_OPTIONS.intl.copy.default });

		await actionCopyLocator.click();
		const actionCopiedLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.copy.copied,
			includeHidden: true,
		});
		await expect.element(actionCopiedLocator).toBeVisible();

		// after a short wile the copy button should be back to default state
		await expect.element(actionCopyLocator).toBeVisible();
	});

	test('use the custom copy function if provided', async () => {
		const customCopyText = 'custom text';
		await setupPage(example1, {
			copy: () => customCopyText,
		});
		const actionCopyLocator = page.getByRole('button', { name: DEFAULT_OPTIONS.intl.copy.default });
		await actionCopyLocator.click();
		expect(normaliseNewline(await navigator.clipboard.readText())).toBe(customCopyText);
	});

	test('skip if text to copy is empty', async () => {
		const spyOnWriteText = vi.spyOn(navigator.clipboard, 'writeText');
		const customCopyText = '';
		await setupPage(example1, {
			copy: () => customCopyText,
		});
		const actionCopyLocator = page.getByRole('button', { name: DEFAULT_OPTIONS.intl.copy.default });
		await actionCopyLocator.click();
		expect(spyOnWriteText).not.toHaveBeenCalled();
	});

	test('auto-recover if attributes were removed', async () => {
		const main = await setupPage(example1);
		const copyActionEl = main.querySelector('.codeblock-copy')!;
		copyActionEl.removeAttribute('aria-label');
		copyActionEl.removeAttribute('data-copied-label');
		copyActionEl.firstElementChild!.removeAttribute('data-copied-class');

		const actionCopyLocator = page.elementLocator(copyActionEl);
		await actionCopyLocator.click();

		const actionCopiedLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.copy.copied,
		});
		await expect.element(actionCopiedLocator).toBeVisible();
		expect(normaliseNewline(await navigator.clipboard.readText())).toBe(
			main.querySelector('pre')!.textContent!,
		);
	});
});

describe('fullscreen functionaility should work', () => {
	test('can open and close', async () => {
		const main = await setupPage(example3);
		// open fullscreen
		await assertIconByClassName(
			'codeblock-fullscreen',
			DEFAULT_OPTIONS.iconClasses.fullscreen.open,
		);
		const openFullscreenLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.fullscreen.open,
		});
		await openFullscreenLocator.click();
		await expect.poll(() => document.fullscreenElement).toBe(main.firstElementChild);

		// close fullscreen
		await assertIconByClassName(
			'codeblock-fullscreen',
			DEFAULT_OPTIONS.iconClasses.fullscreen.exit,
		);
		const exitFullscreenLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.fullscreen.exit,
		});
		await exitFullscreenLocator.click();
		await expect.poll(() => (document.fullscreenElement ? null : 'exitted')).toBeTruthy();
	});

	test('collapse action should be disabled in fullscreen', async () => {
		await setupPage(example3);

		// open fullscreen
		const openFullscreenLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.fullscreen.open,
		});
		await openFullscreenLocator.click();

		// collapse action should be disabled
		const collapseLocator = page.getByRole('switch', {
			name: DEFAULT_OPTIONS.intl.collapse,
			includeHidden: true,
		});
		await expect.element(collapseLocator).toBeDisabled();

		const exitFullscreenLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.fullscreen.exit,
		});
		await exitFullscreenLocator.click();

		// collapse action should be enabled
		await expect.element(collapseLocator).toBeEnabled();
	});

	test('collapsed codeblock should be expanded in fullscreen', async () => {
		const main = await setupPage(example4);

		// collapse codeblock
		const collapseSwitch = page.getByRole('switch', { name: DEFAULT_OPTIONS.intl.collapse });
		const collapseLocator = page.getByLabelText(DEFAULT_OPTIONS.intl.collapse);
		await collapseLocator.click();
		await expect.element(collapseSwitch).toBeChecked();
		await expect.poll(() => main.querySelector('.codeblock-content')?.clientHeight).toBe(0);

		// open fullscreen
		const openFullscreenLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.fullscreen.open,
		});
		await openFullscreenLocator.click();

		// codeblock should be expanded in fullscreen
		await expect
			.poll(() => main.querySelector('.codeblock-content')?.clientHeight)
			.toBeGreaterThan(0);
		await expect.element(collapseSwitch).not.toBeChecked();
	});

	test('auto-recover if attributes were removed', async () => {
		const main = await setupPage(example3);
		const fullscreenActionEl = main.querySelector('.codeblock-fullscreen')!;
		fullscreenActionEl.removeAttribute('data-open-label');
		fullscreenActionEl.removeAttribute('data-exit-label');
		fullscreenActionEl.firstElementChild!.removeAttribute('data-exit-class');
		fullscreenActionEl.firstElementChild!.removeAttribute('data-open-class');
		const openFullscreenLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.fullscreen.open,
		});
		await openFullscreenLocator.click();
		await expect.poll(() => document.fullscreenElement).toBe(main.firstElementChild);
		const exitFullscreenLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.fullscreen.exit,
		});
		await exitFullscreenLocator.click();
		await expect.poll(() => (document.fullscreenElement ? null : 'exitted')).toBeTruthy();
	});

	test('font-size is x1.25', async () => {
		const main = await setupPage(example3);
		const codeblock = main.querySelector('.codeblock')!;
		await expect.poll(() => getComputedStyle(codeblock).fontSize).toBe('16px');
		const openFullscreenLocator = page.getByRole('button', {
			name: DEFAULT_OPTIONS.intl.fullscreen.open,
		});
		await openFullscreenLocator.click();
		await expect.poll(() => getComputedStyle(codeblock).fontSize).toBe('20px');
	});
});

test('can switch tabs in group', async () => {
	const main = await setupPage(example6);

	// get tabs
	const tab1 = page.getByRole('tab').nth(0);
	const tab2 = page.getByRole('tab').nth(1);
	const tab3 = page.getByRole('tab').nth(2);

	// get tab panels
	const panel1 = main.querySelector('.codeblock:nth-of-type(1)')!;
	const panel2 = main.querySelector('.codeblock:nth-of-type(2)')!;
	const panel3 = main.querySelector('.codeblock:nth-of-type(3)')!;

	// default: tab1 is selected
	await expect.element(tab1).toHaveAttribute('aria-selected', 'true');
	await expect.element(page.elementLocator(panel1)).toBeVisible();
	await expect.element(tab2).toHaveAttribute('aria-selected', 'false');
	await expect.element(page.elementLocator(panel2)).not.toBeVisible();
	await expect.element(tab3).toHaveAttribute('aria-selected', 'false');
	await expect.element(page.elementLocator(panel3)).not.toBeVisible();

	// click tab 2
	await tab2.click();
	await expect.element(tab1).toHaveAttribute('aria-selected', 'false');
	await expect.element(page.elementLocator(panel1)).not.toBeVisible();
	await expect.element(tab2).toHaveAttribute('aria-selected', 'true');
	await expect.element(page.elementLocator(panel2)).toBeVisible();
	await expect.element(tab3).toHaveAttribute('aria-selected', 'false');
	await expect.element(page.elementLocator(panel3)).not.toBeVisible();

	// click tab 3
	await tab3.click();
	await expect.element(tab1).toHaveAttribute('aria-selected', 'false');
	await expect.element(page.elementLocator(panel1)).not.toBeVisible();
	await expect.element(tab2).toHaveAttribute('aria-selected', 'false');
	await expect.element(page.elementLocator(panel2)).not.toBeVisible();
	await expect.element(tab3).toHaveAttribute('aria-selected', 'true');
	await expect.element(page.elementLocator(panel3)).toBeVisible();

	// click back tab 1
	await tab1.click();
	await expect.element(tab1).toHaveAttribute('aria-selected', 'true');
	await expect.element(page.elementLocator(panel1)).toBeVisible();
	await expect.element(tab2).toHaveAttribute('aria-selected', 'false');
	await expect.element(page.elementLocator(panel2)).not.toBeVisible();
	await expect.element(tab3).toHaveAttribute('aria-selected', 'false');
	await expect.element(page.elementLocator(panel3)).not.toBeVisible();
});

describe('support keyboard navigation for tab group', () => {
	test('click "Home" to go to first tab', async () => {
		await setupPage(example6);
		// get tabs
		const tab1 = page.getByRole('tab').nth(0);
		const tab3 = page.getByRole('tab').nth(2);

		// click tab 3 to get focus
		await tab3.click();
		await expect.element(tab3).toHaveAttribute('aria-selected', 'true');

		// press Home
		await userEvent.keyboard('{Home}');
		await expect.element(tab1).toHaveAttribute('aria-selected', 'true');
	});

	test('click "End" to go to first tab', async () => {
		await setupPage(example6);
		// get tabs
		const tab1 = page.getByRole('tab').nth(0);
		const tab3 = page.getByRole('tab').nth(2);

		// click tab 1 to get focus
		await tab1.click();
		await expect.element(tab1).toHaveAttribute('aria-selected', 'true');

		// press End
		await userEvent.keyboard('{End}');
		await expect.element(tab3).toHaveAttribute('aria-selected', 'true');
	});

	test('click "ArrowRight" to go to next tab', async () => {
		await setupPage(example6);
		// get tabs
		const tab1 = page.getByRole('tab').nth(0);
		const tab2 = page.getByRole('tab').nth(1);
		const tab3 = page.getByRole('tab').nth(2);

		// click tab 1 to get focus
		await tab1.click();
		await expect.element(tab1).toHaveAttribute('aria-selected', 'true');

		// press ArrowRight to go to tab 2
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(tab2).toHaveAttribute('aria-selected', 'true');

		// press ArrowRight again to go to tab 3
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(tab3).toHaveAttribute('aria-selected', 'true');
	});

	test('click "ArrowLeft" to go to previous tab', async () => {
		await setupPage(example6);
		// get tabs
		const tab1 = page.getByRole('tab').nth(0);
		const tab2 = page.getByRole('tab').nth(1);
		const tab3 = page.getByRole('tab').nth(2);

		// click tab 3 to get focus
		await tab3.click();
		await expect.element(tab3).toHaveAttribute('aria-selected', 'true');

		// press ArrowLeft to go to tab 2
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(tab2).toHaveAttribute('aria-selected', 'true');

		// press ArrowLeft again to go to tab 1
		await userEvent.keyboard('{ArrowLeft}');
		await expect.element(tab1).toHaveAttribute('aria-selected', 'true');
	});

	test('click some other normarl key should not change the selected tab', async () => {
		await setupPage(example6);
		// get tabs
		const tab1 = page.getByRole('tab').nth(0);

		// click tab 1 to get focus
		await tab1.click();
		await expect.element(tab1).toHaveAttribute('aria-selected', 'true');

		// press "Del" key
		await userEvent.keyboard('{Del}');
		await expect.element(tab1).toHaveAttribute('aria-selected', 'true');
	});
});

describe('reduced-motion: disable all transitions', async () => {
	afterEach(async () => {
		const actionCopy = document.querySelector('.codeblock-copy')!;
		await expect.poll(() => getComputedStyle(actionCopy).transitionProperty).toBe('none');

		const actionFullscreen = document.querySelector('.codeblock-fullscreen')!;
		await expect.poll(() => getComputedStyle(actionFullscreen).transitionProperty).toBe('none');

		const actionCollapse = document.querySelector('.codeblock-collapse')!;
		await expect.poll(() => getComputedStyle(actionCollapse).transitionProperty).toBe('none');

		const content = document.querySelector('.codeblock-content')!;
		await expect.poll(() => getComputedStyle(content).transitionProperty).toBe('none');

		const lang = document.querySelector('.codeblock-lang')!;
		await expect.poll(() => getComputedStyle(lang).transitionProperty).toBe('none');
	});

	test('standalone, no title', async () => {
		await commands.emulateMedia({ reducedMotion: 'reduce' });
		const main = await setupPage(example1);

		const actions = main.querySelector('.codeblock-actions')!;
		await expect.poll(() => getComputedStyle(actions).transitionProperty).toBe('none');
	});

	test('standalone, with title', async () => {
		await commands.emulateMedia({ reducedMotion: 'reduce' });
		await setupPage(example4);
	});

	test('group', async () => {
		await commands.emulateMedia({ reducedMotion: 'reduce' });
		const main = await setupPage(example4);
		const tabs = main.querySelectorAll('.codeblock-tab');
		for (const tab of tabs) {
			await expect.poll(() => getComputedStyle(tab).transitionProperty).toBe('none');
		}
	});
});

test('no transition when clicking on tabs', async () => {
	const main = await setupPage(example6);
	const tab1 = page.getByRole('tab').nth(0);
	await tab1.hover();

	const content = main.querySelector('.codeblock-content')!;
	await expect.poll(() => getComputedStyle(content).transitionProperty).toBe('none');
});

test('trim should be applied', async () => {
	const main = await setupPage(example7);

	const preNone = main.querySelector('.codeblock:nth-of-type(1) pre');
	assert.isDefined(preNone);
	await expect.poll(() => preNone?.textContent).toMatch(/\n[^\n\r]*\n/);

	const preBoth = main.querySelector('.codeblock:nth-of-type(2) pre');
	assert.isDefined(preBoth);
	await expect.poll(() => preBoth?.textContent).toMatch(/[^\n\r]*/);

	const preStart = main.querySelector('.codeblock:nth-of-type(3) pre');
	assert.isDefined(preStart);
	await expect.poll(() => preStart?.textContent).toMatch(/\n[^\n\r]*/);

	const preEnd = main.querySelector('.codeblock:nth-of-type(4) pre');
	assert.isDefined(preEnd);
	await expect.poll(() => preEnd?.textContent).toMatch(/[^\n\r]*\n/);
});
