import { test } from 'vitest';

import { make_tab_node } from '../../../../src/internals/ast/tablist/make-tab-node';
import { create_id } from '../../../../src/internals/create-id';
import { DEFAULT_OPTIONS } from '../../../../src/internals/resolve-options';
import { html, matchStringIgnoringWhitespace, mdast2html } from '../../../test-utils';

const id = create_id();
const groupId = create_id();
const title = 'Tab 1';
const fileIconClasses = DEFAULT_OPTIONS.iconClasses.file('javascript');

test('checked with file icon classes', () => {
	const node = make_tab_node(
		{
			id,
			groupId,
			checked: true,
			title,
			fileIconClasses,
		},
		{ type: 'custom' },
	);
	const str = mdast2html(node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<label
				class="codeblock-tab"
				id="${id}-tab"
				role="tab"
				for="${id}"
				aria-controls="${id}-tabpanel"
			>
				<input
					class="codeblock-tab-selected sr-only"
					type="radio"
					name="${groupId}"
					id="${id}"
					checked
				/>
				<span class="codeblock-title">
					<i class="${fileIconClasses}"></i>
					${title}
				</span>
			</label>
		`,
	);
});

test('not checked', () => {
	const node = make_tab_node(
		{
			id,
			groupId,
			checked: false,
			title,
			fileIconClasses,
		},
		{ type: 'custom' },
	);
	const str = mdast2html(node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<label
				class="codeblock-tab"
				id="${id}-tab"
				role="tab"
				for="${id}"
				aria-controls="${id}-tabpanel"
			>
				<input class="codeblock-tab-selected sr-only" type="radio" name="${groupId}" id="${id}" />
				<span class="codeblock-title">
					<i class="${fileIconClasses}"></i>
					${title}
				</span>
			</label>
		`,
	);
});

test('no file icon classes', () => {
	const node = make_tab_node(
		{
			id,
			groupId,
			checked: false,
			title,
			fileIconClasses: false,
		},
		{ type: 'custom' },
	);
	const str = mdast2html(node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<label class="codeblock-tab"
				id="${id}-tab"
				role="tab"
				for="${id}"
				aria-controls="${id}-tabpanel"
			>
				<input class="codeblock-tab-selected sr-only" type="radio" name="${groupId}" id="${id}" />
				<span class="codeblock-title"> ${title} </span>
			</label>
		`,
	);
});
