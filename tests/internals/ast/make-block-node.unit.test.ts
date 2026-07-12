import { u } from 'unist-builder';
import { test } from 'vitest';

import { make_block_node } from '../../../src/internals/ast/make-block-node';
import type { MakeNodeContext } from '../../../src/internals/ast/make-node';
import { create_id } from '../../../src/internals/create-id';
import { DEFAULT_OPTIONS } from '../../../src/internals/resolve-options';
import {
	COMMON_ACTIONS_HTML,
	html,
	matchStringIgnoringWhitespace,
	mdast2html,
} from '../../test-utils';

const make_node_context: MakeNodeContext = { type: 'custom' };

const makeOnelinerCode = () => u('code', { lang: 'js' }, 'console.log("Hello, world!");');
const makeMultilineCode = () =>
	u('code', { lang: 'js' }, 'console.log("Hello, world!");\nconsole.log("Goodbye, world!");');

test('standalone, no title, oneliner', () => {
	const code = makeOnelinerCode();
	const block_node = make_block_node(
		{
			variant: 'standalone',
			title: null,
			fileIcon: false,
			code,
			intl: DEFAULT_OPTIONS.intl,
			iconClasses: DEFAULT_OPTIONS.iconClasses,
		},
		make_node_context,
	);
	const str = mdast2html(block_node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<div class="codeblock codeblock-root" data-oneliner>
				${COMMON_ACTIONS_HTML}
				<div class="codeblock-content">
					<span class="codeblock-lang">js</span>
					<pre><code class="language-js">console.log("Hello, world!"); </code></pre>
				</div>
			</div>
		`,
	);
});

test('standalone, no title, multiline', () => {
	const multiline_code = makeMultilineCode();
	const block_node = make_block_node(
		{
			variant: 'standalone',
			title: null,
			fileIcon: false,
			code: multiline_code,
			intl: DEFAULT_OPTIONS.intl,
			iconClasses: DEFAULT_OPTIONS.iconClasses,
		},
		make_node_context,
	);
	const str = mdast2html(block_node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<div class="codeblock codeblock-root">
				${COMMON_ACTIONS_HTML}
				<div class="codeblock-content">
					<span class="codeblock-lang">js</span>
					<pre><code class="language-js">console.log("Hello, world!");
console.log("Goodbye, world!"); </code></pre>
				</div>
			</div>
		`,
	);
});

test('standalone, titled, oneliner', () => {
	const code = makeOnelinerCode();
	const block_node = make_block_node(
		{
			variant: 'standalone',
			title: 'script.js',
			fileIcon: false,
			code,
			intl: DEFAULT_OPTIONS.intl,
			iconClasses: DEFAULT_OPTIONS.iconClasses,
		},
		make_node_context,
	);
	const str = mdast2html(block_node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<div class="codeblock codeblock-root" data-oneliner>
				<header class="codeblock-header">
					<span class="codeblock-title">script.js</span>
					${COMMON_ACTIONS_HTML}
				</header>
				<div class="codeblock-content">
					<span class="codeblock-lang">js</span>
					<pre><code class="language-js">console.log("Hello, world!");
		</code></pre>
				</div>
			</div>
		`,
	);
});

test('standalone, titled, multiline', () => {
	const multiline_code = makeMultilineCode();
	const block_node = make_block_node(
		{
			variant: 'standalone',
			title: 'script.js',
			fileIcon: false,
			code: multiline_code,
			intl: DEFAULT_OPTIONS.intl,
			iconClasses: DEFAULT_OPTIONS.iconClasses,
		},
		make_node_context,
	);
	const str = mdast2html(block_node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<div class="codeblock codeblock-root">
				<header class="codeblock-header">
					<span class="codeblock-title">script.js</span>
					${COMMON_ACTIONS_HTML}
				</header>
				<div class="codeblock-content">
					<span class="codeblock-lang">js</span>
					<pre><code class="language-js">console.log("Hello, world!");
console.log("Goodbye, world!"); </code></pre>
				</div>
			</div>
		`,
	);
});

test('group', () => {
	const code = makeOnelinerCode();
	const tabId = create_id();
	const block_node = make_block_node(
		{
			variant: 'group',
			tabId,
			code,
		},
		make_node_context,
	);
	const str = mdast2html(block_node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<div class="codeblock" data-oneliner>
				<div
					class="codeblock-content"
					id="${tabId}-tabpanel"
					role="tabpanel"
					tabindex="0"
					aria-labelledby="${tabId}-tab"
				>
					<span class="codeblock-lang">js</span>
					<pre><code class="language-js">console.log("Hello, world!"); </code></pre>
				</div>
			</div>
		`,
	);
});
