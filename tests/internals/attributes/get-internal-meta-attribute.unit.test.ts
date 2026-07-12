import type { MetaAttribute } from 'remark-transform-blockquote';
import { describe, expect, test } from 'vitest';

import { InvalidMetaAttributeValueError } from '../../../src/errors';
import { get_internal_meta_attribute } from '../../../src/internals/attributes/get-internal-meta-attribute';
import { TRIM_ALLOWLIST } from '../../../src/internals/attributes/parse-codeblock-meta-attributes';
import { getMdastFromMarkdownString, markdown, parseFirstCodeNode } from '../../test-utils';

test('should return null if attributes are nullish', () => {
	expect(get_internal_meta_attribute(undefined, 'file-icon', 'boolean')).toEqual(null);
});

describe('boolean attribute', () => {
	test('should skip non-internal', async () => {
		const input = markdown`
			~~~javascript file-icon=true
			console.log('Hello World');
			~~~
		`;
		const { metaAttributes } = parseFirstCodeNode(await getMdastFromMarkdownString(input));
		const attribute = get_internal_meta_attribute(metaAttributes, 'file-icon', 'boolean');
		expect(attribute).toEqual(null);
	});

	test('should register internal', async () => {
		const input = markdown`
			~~~javascript #file-icon=false
			console.log('Hello World');
			~~~
		`;
		const { metaAttributes } = parseFirstCodeNode(await getMdastFromMarkdownString(input));
		const attribute = get_internal_meta_attribute(metaAttributes, 'file-icon', 'boolean');
		expect(attribute).toEqual({
			type: 'boolean',
			name: 'file-icon',
			value: false,
		} satisfies MetaAttribute);
	});
});

describe('string attribute', () => {
	test('should skip non-internal', async () => {
		const input = markdown`
			~~~javascript title="An example"
			console.log('Hello World');
			~~~
		`;
		const { metaAttributes } = parseFirstCodeNode(await getMdastFromMarkdownString(input));
		const attribute = get_internal_meta_attribute(metaAttributes, 'title', 'string');
		expect(attribute).toEqual(null);
	});

	test('should register internal', async () => {
		const input = markdown`
			~~~javascript #title="An example"
			console.log('Hello World');
			~~~
		`;
		const { metaAttributes } = parseFirstCodeNode(await getMdastFromMarkdownString(input));
		const attribute = get_internal_meta_attribute(metaAttributes, 'title', 'string');
		expect(attribute).toEqual({
			type: 'string',
			name: 'title',
			value: 'An example',
		} satisfies MetaAttribute);
	});

	test('should throw if value is not in allowlist', async () => {
		const input = markdown`
			~~~javascript #trim=nonesense
			console.log('Hello World');
			~~~
		`;
		const { metaAttributes } = parseFirstCodeNode(await getMdastFromMarkdownString(input));
		expect(() =>
			get_internal_meta_attribute(metaAttributes, 'trim', 'string', TRIM_ALLOWLIST),
		).toThrow(InvalidMetaAttributeValueError);
	});

	test('should accept if value is in allowlist', async () => {
		const input = markdown`
			~~~javascript #trim=none
			console.log('Hello World');
			~~~
		`;
		const { metaAttributes } = parseFirstCodeNode(await getMdastFromMarkdownString(input));
		const attribute = get_internal_meta_attribute(metaAttributes, 'trim', 'string', TRIM_ALLOWLIST);
		expect(attribute).toEqual({
			type: 'string',
			name: 'trim',
			value: 'none',
		} satisfies MetaAttribute);
	});
});
