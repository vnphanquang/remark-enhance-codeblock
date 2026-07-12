import { u } from 'unist-builder';
import { describe, test } from 'vitest';

import { type MakeNodeContext, make_node } from '../../../src/internals/ast/make-node';
import { html, matchStringIgnoringWhitespace, mdast2html } from '../../test-utils';

/* tags currently used by the plugin */
const HTML_TAGS = ['div', 'header', 'span', 'i', 'button', 'lablel'];
const SELF_CLOSING_TAGS = ['input'];

const make_node_context: MakeNodeContext = { type: 'custom' };

describe('support all used HTML tags', () => {
	for (const hName of HTML_TAGS) {
		test(`<${hName}>`, () => {
			const node = make_node(
				{ hName, hProperties: { className: 'test' }, children: [u('text', 'something')] },
				make_node_context,
			);
			const str = mdast2html(node);
			matchStringIgnoringWhitespace(str, html`<${hName} class="test">something</${hName}>`);
		});
	}

	for (const hName of SELF_CLOSING_TAGS) {
		test(`<${hName}/>`, () => {
			const node = make_node({ hName, hProperties: { className: 'test' } }, make_node_context);
			const str = mdast2html(node);
			matchStringIgnoringWhitespace(str, html`<${hName} class="test" />`);
		});
	}
});

test('skip nullish children', () => {
	const node = make_node(
		{
			hName: 'div',
			children: [u('text', 'something'), null, undefined, u('text', 'else')],
		},
		make_node_context,
	);
	const str = mdast2html(node);
	matchStringIgnoringWhitespace(str, html`<div>somethingelse</div>`);
});
