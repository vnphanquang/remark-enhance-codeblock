import { select } from 'hast-util-select';
import { toHtml } from 'hast-util-to-html';
import { toString } from 'hast-util-to-string';
import { assert, describe, expect, test } from 'vitest';

import { make_header_node } from '../../../src/internals/ast/make-header-node';
import type { MakeNodeContext } from '../../../src/internals/ast/make-node';
import { create_id } from '../../../src/internals/create-id';
import { DEFAULT_OPTIONS } from '../../../src/internals/resolve-options';
import type { GroupContext, GroupTabContext } from '../../../src/types.private';
import {
	COMMON_ACTIONS_HTML,
	html,
	matchStringIgnoringWhitespace,
	mdast2hast,
	mdast2html,
} from '../../test-utils';

const make_node_context: MakeNodeContext = { type: 'custom' };

describe('standalone', () => {
	const commonInput = {
		variant: 'standalone',
		title: 'A Javascript Example',
		lang: 'javascript',
		fileIcon: true,
		intl: DEFAULT_OPTIONS.intl,
		iconClasses: DEFAULT_OPTIONS.iconClasses,
	} as const satisfies Parameters<typeof make_header_node>[0];

	test('output correct html structure', () => {
		const node = make_header_node(commonInput, make_node_context);
		assert.isNotNull(node);
		matchStringIgnoringWhitespace(
			mdast2html(node),
			html`
				<header class="codeblock-header">
					<span class="codeblock-title">
						<i class="${DEFAULT_OPTIONS.iconClasses.file('javascript')}"></i>
						${commonInput.title}
					</span>
					${COMMON_ACTIONS_HTML}
				</header>
			`,
		);
	});

	test('no title returns null', () => {
		const node = make_header_node({ ...commonInput, title: null }, make_node_context);
		expect(node).toBeNull();
	});

	test('no file icon', () => {
		const node = make_header_node({ ...commonInput, fileIcon: false }, make_node_context);
		assert.isNotNull(node);
		const hast = mdast2hast(node);
		const i = select('.codeblock-title i', hast);
		expect(i).toBeUndefined();
	});
});

describe('group', () => {
	const tab1: GroupTabContext = {
		id: create_id(),
		title: 'index.html',
		fileIcon: null,
		lang: 'html',
	};
	const tab2: GroupTabContext = {
		id: create_id(),
		title: 'styles.css',
		fileIcon: null,
		lang: 'css',
	};
	const tab3: GroupTabContext = {
		id: create_id(),
		title: 'script.js',
		fileIcon: null,
		lang: 'javascript',
	};
	const group: GroupContext = {
		id: create_id(),
		fileIcon: null,
		tabs: [tab1, tab2, tab3],
	};

	test('output correct html structure', () => {
		const node = make_header_node(
			{
				variant: 'group',
				group,
				intl: DEFAULT_OPTIONS.intl,
				iconClasses: DEFAULT_OPTIONS.iconClasses,
			},
			make_node_context,
		);
		const str = mdast2html(node);
		matchStringIgnoringWhitespace(
			str,
			html`
				<header class="codeblock-header">
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
								name="${group.id}"
								id="${tab1.id}"
								checked
							/>
							<span class="codeblock-title">
								<i class="${DEFAULT_OPTIONS.iconClasses.file('html')}"></i>
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
								name="${group.id}"
								id="${tab2.id}"
							/>
							<span class="codeblock-title">
								<i class="${DEFAULT_OPTIONS.iconClasses.file('css')}"></i>
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
								name="${group.id}"
								id="${tab3.id}"
							/>
							<span class="codeblock-title">
								<i class="${DEFAULT_OPTIONS.iconClasses.file('javascript')}"></i>
								${tab3.title}
							</span>
						</label>
					</div>
					${COMMON_ACTIONS_HTML}
				</header>
			`,
		);
	});

	test('no title given, fallback to index', () => {
		const node = make_header_node(
			{
				variant: 'group',
				group: {
					id: create_id(),
					fileIcon: null,
					tabs: [
						{
							id: create_id(),
							title: null,
							fileIcon: null,
							lang: 'javascript',
						},
					],
				},
				intl: DEFAULT_OPTIONS.intl,
				iconClasses: DEFAULT_OPTIONS.iconClasses,
			},
			make_node_context,
		);
		const hast = mdast2hast(node);
		const title = select('.codeblock-title', hast);
		assert.isDefined(title);
		expect(toString(title)).toBe('Tab 1');
	});

	describe('overriding file-icon', () => {
		const configs = [
			{ group: null, tab: null, expect: true },
			{ group: null, tab: false, expect: false },
			{ group: null, tab: true, expect: true },
			{ group: true, tab: null, expect: true },
			{ group: true, tab: false, expect: false },
			{ group: true, tab: true, expect: true },
			{ group: false, tab: null, expect: false },
			{ group: false, tab: false, expect: false },
			{ group: false, tab: true, expect: true },
		];
		for (const config of configs) {
			test(`group:${config.group}, tab:${config.tab}`, () => {
				const node = make_header_node(
					{
						variant: 'group',
						group: {
							id: create_id(),
							fileIcon: config.group,
							tabs: [
								{
									id: create_id(),
									title: null,
									fileIcon: config.tab,
									lang: null,
								},
							],
						},
						intl: DEFAULT_OPTIONS.intl,
						iconClasses: DEFAULT_OPTIONS.iconClasses,
					},
					make_node_context,
				);
				const hast = mdast2hast(node);
				const i = select('.codeblock-title i', hast);
				if (!config.expect) {
					expect(i).toBeUndefined();
				} else {
					assert.isDefined(i);
					matchStringIgnoringWhitespace(
						toHtml(i),
						html`<i class="${DEFAULT_OPTIONS.iconClasses.file('')}"></i>`,
					);
				}
			});
		}
	});
});
