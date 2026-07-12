/* eslint-disable jsdoc/reject-any-type */

import { make_actions_node } from './actions/make-actions-node';
import { make_node } from './make-node';
import { make_title_node } from './make-title-node';
import { make_tablist_node } from './tablist/make-tablist-node';

/**
 * @typedef MakeStandaloneHeaderNodeInput
 * @property {'standalone'} variant
 * @property {string | null} title
 * @property {import('../../types.private').Lang} lang
 * @property {boolean} fileIcon
 * @property {import('../../types.private').ResolvedOptions['intl']} intl
 * @property {import('../../types.private').ResolvedOptions['iconClasses']} iconClasses
 */

/**
 * @typedef MakeGroupHeaderNodeInput
 * @property {'group'} variant
 * @property {import('../../types.private').GroupContext} group
 * @property {import('../../types.private').ResolvedOptions['intl']} intl
 * @property {import('../../types.private').ResolvedOptions['iconClasses']} iconClasses
 */

/**
 * @template {MakeStandaloneHeaderNodeInput | MakeGroupHeaderNodeInput} I
 * @template {I extends MakeGroupHeaderNodeInput ? import('unist').Parent : (import('unist').Parent | null)} O
 * @param {I} input
 * @param {import('./make-node').MakeNodeContext} context
 * @returns {O}
 */
export function make_header_node(input, context) {
	if (input.variant === 'standalone') {
		const { title, fileIcon, lang, intl, iconClasses } = input;
		if (!title) return /** @type {O} */ (null);
		return /** @type {any} */ (
			make_node(
				{
					hName: 'header',
					hProperties: {
						className: 'codeblock-header',
					},
					children: [
						make_title_node(
							{
								text: title,
								fileIconClasses: fileIcon && iconClasses.file(lang),
							},
							context,
						),
						make_actions_node({ intl, iconClasses }, context),
					],
				},
				context,
			)
		);
	}

	const { group, intl, iconClasses } = input;
	return /** @type {any} */ (
		make_node(
			{
				hName: 'header',
				hProperties: {
					className: 'codeblock-header',
				},
				children: [
					make_tablist_node(
						group.tabs.map(({ id, lang, title, fileIcon }, index) => ({
							id,
							title: title ?? `Tab ${index + 1}`,
							checked: index === 0,
							fileIconClasses:
								(fileIcon === true || (group.fileIcon !== false && fileIcon !== false)) &&
								iconClasses.file(lang),
							groupId: group.id,
						})),
						context,
					),
					make_actions_node({ intl, iconClasses }, context),
				],
			},
			context,
		)
	);
}
