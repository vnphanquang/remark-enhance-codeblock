import { select } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import { u } from 'unist-builder';
import { VFile } from 'vfile';
import { assert, describe, expect, test, vi } from 'vitest';

import { type RemarkEnhanceCodeblockIntlSpecs, defaultOptions } from '../src';
import { remarkEnhanceCodeblock } from '../src/plugin';

import { markdown2hast, markdown } from './test-utils';

test("skip if code doesn't live in a typical mdast container", () => {
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any  */
	const plugin = remarkEnhanceCodeblock.bind(this as any)();
	const code = u('code', { lang: 'js' }, 'console.log("Hello, world!");');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugin?.(code as any, new VFile(), () => {});
	expect(code).toEqual(code);
});

test('remove non-code elements within group', async () => {
	const textToStrip = 'This text should be stripped';
	const input = markdown`
		> [!CODEGROUP]
		>
		> ~~~
		> code content
		> ~~~
		>
		> ${textToStrip}
	`;
	const hast = await markdown2hast(input);
	const p = select('p', hast);
	expect(p).toBeUndefined();
});

describe('file-icon', () => {
	test('can turn off file-icon for group', async () => {
		const input = markdown`
			> [!CODEGROUP] \`#file-icon=false\`
			>
			> ~~~
			> code content 1
			> ~~~
			>
			> ~~~
			> code content 2
			> ~~~
		`;
		const hast = await markdown2hast(input);
		const i = select('.codeblock-title i', hast);
		expect(i).toBeUndefined();
	});

	test('can turn off file-icon via plugin options', async () => {
		const input = markdown`
			> [!CODEGROUP]
			>
			> ~~~
			> code content 1
			> ~~~
			>
			> ~~~
			> code content 2
			> ~~~
		`;
		const hast = await markdown2hast(input, {
			iconClasses: {
				file: () => null,
			},
		});
		const i = select('.codeblock-title i', hast);
		expect(i).toBeUndefined();
	});

	test('can override file-icon for individual tabs', async () => {
		const input = markdown`
			> [!CODEGROUP] \`#file-icon=false\`
			>
			> ~~~js \`#file-icon=false\`
			> code content 1
			> ~~~
			>
			> ~~~ts \`#file-icon=true\`
			> code content 2
			> ~~~
		`;
		const hast = await markdown2hast(input);
		const iJs = select('.codeblock-title i.i-file-js', hast);
		expect(iJs).toBeUndefined();
		const iTs = select('.codeblock-title i.i-file-ts', hast);
		expect(iTs).toBeDefined();
	});
});

test('extra non-internal attributes on code are passed to .codeblock', async () => {
	const input = markdown`
		~~~js data-foo=bar $class="custom-code"

		~~~
	`;
	const hast = await markdown2hast(input);
	const code = select('.codeblock', hast);
	expect(code?.properties?.['data-foo']).toBe('bar');
	expect(code?.properties?.['className']).toContain('custom-code');
});

test('extra non-internal attributes on group are passed to .codeblock-group', async () => {
	const input = markdown`
		> [!CODEGROUP] \`data-foo=bar $class="custom-group"\`
		>
		> ~~~
		> code content 1
		> ~~~
	`;
	const hast = await markdown2hast(input);
	const group = select('.codeblock-group', hast);
	assert.isDefined(group);
	assert.isDefined(group.properties);
	expect(group.properties['data-foo']).toBe('bar');
	expect(group.properties['className']).toContain('custom-group');
});

describe('trim', () => {
	test('can customise via plugin options', async () => {
		const content = '\n\ncontent\n\n';
		const input = markdown`
			~~~plain data-foo=bar
			${content}
			~~~
		`;
		const hast = await markdown2hast(input, { trim: 'start' });
		const code = select('code', hast);
		assert.isDefined(code);
		expect(toString(code)).toBe('content\n\n\n');
	});

	test('can override via meta', async () => {
		const content = '\n\ncontent\n\n';
		const input = markdown`
			~~~plain data-foo=bar #trim=end
			${content}
			~~~
		`;
		const hast = await markdown2hast(input, { trim: 'start' });
		const code = select('code', hast);
		assert.isDefined(code);
		expect(toString(code)).toBe('\n\ncontent\n');
	});
});

describe('internationalisation', () => {
	const specs = {
		vi: {
			collapse: 'Thu gọn',
		},
		en: defaultOptions.intl,
	} as Record<string, RemarkEnhanceCodeblockIntlSpecs>;

	test('can customise via block meta locale', async () => {
		const input = markdown`
			~~~js #locale=vi
			console.log('Xin chào');
			~~~
		`;
		const hast = await markdown2hast(input, {
			intl: ({ locale }) => specs[locale ?? 'en'],
		});
		const collapse = select('.codeblock-collapse', hast);
		assert.isDefined(collapse);
		expect(collapse.properties['aria-label']).toBe('Thu gọn');
	});

	test('can customise via group meta locale', async () => {
		const input = markdown`
			> [!CODEGROUP] \`#locale=vi\`
			>
			> ~~~js
			> console.log('Xin chào');
			> ~~~
		`;
		const hast = await markdown2hast(input, {
			intl: ({ locale }) => specs[locale ?? 'en'],
		});
		const collapse = select('.codeblock-collapse', hast);
		assert.isDefined(collapse);
		expect(collapse.properties['aria-label']).toBe('Thu gọn');
	});

	test('group meta should take precedence over block meta', async () => {
		const spyOnConsoleWarn = vi.spyOn(console, 'warn');
		spyOnConsoleWarn.mockImplementationOnce(() => {});
		const input = markdown`
			> [!CODEGROUP] \`#locale=en\`
			>
			> ~~~js #locale=vi
			> console.log('Hello');
			> ~~~
		`;
		const hast = await markdown2hast(input, {
			intl: ({ locale }) => specs[locale ?? 'en'],
		});
		const collapse = select('.codeblock-collapse', hast);
		assert.isDefined(collapse);
		expect(collapse.properties['aria-label']).toBe(defaultOptions.intl.collapse);
		expect(spyOnConsoleWarn).toHaveBeenCalledWith(
			'[remark-enhance-codeblock] detected #locale on group but also on its code blocks. Locale on group will take precendence because i18n elements are shared in code group',
		);
		spyOnConsoleWarn.mockRestore();
	});

	test('can customise via filename', async () => {
		const input = markdown`
			~~~js
			console.log('Hello');
			~~~
		`;
		const file = new VFile({
			value: input,
			path: '~/test.vi.md',
		});
		const hast = await markdown2hast(file, {
			intl: ({ filename }) => {
				return specs[filename?.split('.').at(-2) ?? 'en']
			},
		});
		const collapse = select('.codeblock-collapse', hast);
		assert.isDefined(collapse);
		expect(collapse.properties['aria-label']).toBe('Thu gọn');
	});
});
