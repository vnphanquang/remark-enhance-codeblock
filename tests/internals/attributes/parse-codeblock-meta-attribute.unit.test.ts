import type { MetaAttribute } from 'remark-transform-blockquote';
import { expect, test } from 'vitest';

import { parse_codeblock_meta_attributes } from '../../../src/internals/attributes/parse-codeblock-meta-attributes.js';
import { getMdastFromMarkdownString, markdown, parseFirstCodeNode } from '../../test-utils';

test("empty meta shouldn't throw", () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { attributes, internals } = parse_codeblock_meta_attributes({ meta: undefined } as any);
	expect(attributes).toEqual({});
	expect(internals).toEqual({
		fileIcon: null,
		title: null,
		trim: null,
	});
});

test('should be able to parse all supported internal meta attributes', async () => {
	const input = markdown`
		~~~javascript file-icon #file-icon=false title="To ignore" #title="An example" trim="toignore" #trim="none" #unsupported1 #unsupported2="something"
		console.log('Hello World');
		~~~
	`;
	const { code } = parseFirstCodeNode(await getMdastFromMarkdownString(input));
	const { attributes, internals } = parse_codeblock_meta_attributes(code);
	expect(attributes).toEqual({
		'file-icon': {
			name: 'file-icon',
			type: 'boolean',
			value: false,
		},
		title: {
			name: 'title',
			type: 'string',
			value: 'An example',
		},
		trim: {
			name: 'trim',
			type: 'string',
			value: 'none',
		},
		unsupported1: {
			name: 'unsupported1',
			type: 'boolean',
			value: true,
		},
		unsupported2: {
			name: 'unsupported2',
			type: 'string',
			value: 'something',
		},
	} satisfies Record<string, MetaAttribute>);
	expect(internals).toEqual({
		fileIcon: false,
		title: 'An example',
		trim: 'none',
	});
});
