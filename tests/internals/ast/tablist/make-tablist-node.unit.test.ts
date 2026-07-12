import { test } from 'vitest';

import { make_tablist_node } from '../../../../src/internals/ast/tablist/make-tablist-node';
import { create_id } from '../../../../src/internals/create-id';
import { DEFAULT_OPTIONS } from '../../../../src/internals/resolve-options';
import { html, matchStringIgnoringWhitespace, mdast2html } from '../../../test-utils';

test('output to correct html structure', () => {
	const groupId = create_id();
	const tab1 = {
		id: create_id(),
		groupId,
		checked: true,
		title: 'Tab 1',
		fileIconClasses: DEFAULT_OPTIONS.iconClasses.file('javascript'),
	} as const;
	const tab2 = {
		id: create_id(),
		groupId,
		checked: false,
		title: 'Tab 2',
		fileIconClasses: DEFAULT_OPTIONS.iconClasses.file('python'),
	} as const;
	const tab3 = {
		id: create_id(),
		groupId,
		checked: false,
		title: 'Tab 3',
		fileIconClasses: false,
	} as const;
	const node = make_tablist_node([tab1, tab2, tab3], { type: 'custom' });

	const str = mdast2html(node);
	matchStringIgnoringWhitespace(
		str,
		html`
			<div role="tablist" class="codeblock-tabs">
				<label
					class="codeblock-tab"
					id="${tab1.id}-tab"
					role="tab"
					for="${tab1.id}"
					aria-controls="${tab1.id}-tabpanel"
				>
					<input
						class="codeblock-tab-selected sr-only"
						type="radio"
						name="${groupId}"
						id="${tab1.id}"
						checked
					/>
					<span class="codeblock-title">
						<i class="${tab1.fileIconClasses}"></i>
						${tab1.title}
					</span>
				</label>
				<label
					class="codeblock-tab"
					id="${tab2.id}-tab"
					role="tab"
					for="${tab2.id}"
					aria-controls="${tab2.id}-tabpanel"
				>
					<input
						class="codeblock-tab-selected sr-only"
						type="radio"
						name="${groupId}"
						id="${tab2.id}"
					/>
					<span class="codeblock-title">
						<i class="${tab2.fileIconClasses}"></i>
						${tab2.title}
					</span>
				</label>
				<label
					class="codeblock-tab"
					id="${tab3.id}-tab"
					role="tab"
					for="${tab3.id}"
					aria-controls="${tab3.id}-tabpanel"
				>
					<input
						class="codeblock-tab-selected sr-only"
						type="radio"
						name="${groupId}"
						id="${tab3.id}"
					/>
					<span class="codeblock-title">${tab3.title}</span>
				</label>
			</div>
`,
	);
});
