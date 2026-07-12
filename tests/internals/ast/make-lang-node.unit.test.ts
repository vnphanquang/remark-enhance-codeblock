import { assert, expect, test } from 'vitest';

import { make_lang_node } from '../../../src/internals/ast/make-lang-node';
import type { MakeNodeContext } from '../../../src/internals/ast/make-node';
import { html, mdast2html } from '../../test-utils';

const make_node_context: MakeNodeContext = { type: 'custom' };

test('skip when lang is nullish', () => {
	expect(make_lang_node(null, make_node_context)).toBeNull();
	expect(make_lang_node(undefined, make_node_context)).toBeNull();
	expect(make_lang_node('', make_node_context)).toBeNull();
});

test('output to correct html structure', () => {
	const node = make_lang_node('javascript', make_node_context);
	assert.isNotNull(node);
	expect(mdast2html(node)).toBe(html`<span class="codeblock-lang">javascript</span>`);
});
