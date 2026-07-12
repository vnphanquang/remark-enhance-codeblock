import { expect, test } from 'vitest';

import type { MakeNodeContext } from '../../../src/internals/ast/make-node';
import { make_title_node } from '../../../src/internals/ast/make-title-node';
import { html, matchStringIgnoringWhitespace, mdast2html } from '../../test-utils';

const make_node_context: MakeNodeContext = { type: 'custom' };

test('no file icon', () => {
	const node = make_title_node({ text: 'Example' }, make_node_context);
	expect(mdast2html(node)).toBe(html`<span class="codeblock-title">Example</span>`);
});

test('with file icon', () => {
	const node = make_title_node(
		{ text: 'Example', fileIconClasses: 'i i-file i-file-javascript' },
		make_node_context,
	);
	const str = mdast2html(node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<span class="codeblock-title">
				<i class="i i-file i-file-javascript"></i>
				Example
			</span>
		`,
	);
});
