import { select } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import { u } from 'unist-builder';
import { VFile } from 'vfile';
import { assert, describe, expect, test } from 'vitest';

import { remarkEnhanceCodeblock } from '../src/plugin';

import { markdown2hast, markdown } from './test-utils';

test("skip if code doesn't live in a typical mdast container", () => {
	const plugin = remarkEnhanceCodeblock();
	const code = u('code', { lang: 'js' }, 'console.log("Hello, world!");');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugin(code as any, new VFile(), () => {});
	expect(code).toEqual(code);
});

test('remove non-code elements within group', () => {
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
	const hast = markdown2hast(input);
	const p = select('p', hast);
	expect(p).toBeUndefined();
});

describe('file-icon', () => {
	test('can turn off file-icon for group', () => {
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
		const hast = markdown2hast(input);
		const i = select('.codeblock-title i', hast);
		expect(i).toBeUndefined();
	});

	test('can turn off file-icon via plugin options', () => {
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
		const hast = markdown2hast(input, {
			iconClasses: {
				file: () => null,
			},
		});
		const i = select('.codeblock-title i', hast);
		expect(i).toBeUndefined();
	});

	test('can override file-icon for individual tabs', () => {
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
		const hast = markdown2hast(input);
		const iJs = select('.codeblock-title i.i-file-js', hast);
		expect(iJs).toBeUndefined();
		const iTs = select('.codeblock-title i.i-file-ts', hast);
		expect(iTs).toBeDefined();
	});
});

test('extra non-internal attributes on code are passed to .codeblock', () => {
	const input = markdown`
		~~~js data-foo=bar $class="custom-code"

		~~~
	`;
	const hast = markdown2hast(input);
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
	const hast = markdown2hast(input);
	const group = select('.codeblock-group', hast);
	assert.isDefined(group);
	assert.isDefined(group.properties);
	expect(group.properties['data-foo']).toBe('bar');
	expect(group.properties['className']).toContain('custom-group');
});

describe('trim', () => {
	test('can customise via plugin options', () => {
		const content = '\n\ncontent\n\n';
		const input = markdown`
			~~~plain data-foo=bar
			${content}
			~~~
		`;
		const hast = markdown2hast(input, { trim: 'start' });
		const code = select('code', hast);
		assert.isDefined(code);
		expect(toString(code)).toBe('content\n\n\n');
	});

	test('can override via meta', () => {
		const content = '\n\ncontent\n\n';
		const input = markdown`
			~~~plain data-foo=bar #trim=end
			${content}
			~~~
		`;
		const hast = markdown2hast(input, { trim: 'start' });
		const code = select('code', hast);
		assert.isDefined(code);
		expect(toString(code)).toBe('\n\ncontent\n');
	});
});
