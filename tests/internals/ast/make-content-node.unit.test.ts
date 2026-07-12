import { u } from 'unist-builder';
import { test } from 'vitest';

import { make_content_node } from '../../../src/internals/ast/make-content-node';
import type { MakeNodeContext } from '../../../src/internals/ast/make-node';
import { create_id } from '../../../src/internals/create-id';
import { html, matchStringIgnoringWhitespace, mdast2html } from '../../test-utils';

const make_node_context: MakeNodeContext = { type: 'custom' };

const code = u('code', {
	lang: 'javascript',
	value: 'console.log("Hello, world!");',
});

test('standalone', () => {
	const node = make_content_node({ code }, make_node_context);
	const str = mdast2html(node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<div class="codeblock-content">
				<span class="codeblock-lang">javascript</span>
				<pre><code class="language-javascript">console.log("Hello, world!"); </code></pre>
			</div>
		`,
	);
});

test('group', () => {
	const tabId = create_id();
	const node = make_content_node({ code, tabId }, make_node_context);
	const str = mdast2html(node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<div
				class="codeblock-content"
				id="${tabId}-tabpanel"
				role="tabpanel"
				tabindex="0"
				aria-labelledby="${tabId}-tab"
			>
				<span class="codeblock-lang">javascript</span>
				<pre><code class="language-javascript">console.log("Hello, world!"); </code></pre>
			</div>
		`,
	);
});
