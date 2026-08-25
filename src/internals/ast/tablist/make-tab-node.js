import { make_node } from '../make-node';
import { make_title_node } from '../make-title-node';

/**
 * @typedef MakeTabNodeInput
 * @property {string} id
 * @property {string} groupId
 * @property {boolean} checked
 * @property {string} title
 * @property {string | false | null | undefined} fileIconClasses
 */

/**
 * @param {MakeTabNodeInput} input
 * @param {import('../make-node').MakeNodeContext} context
 * @returns {import('unist').Node}
 */
export function make_tab_node(input, context) {
	const { id, groupId, checked, title, fileIconClasses } = input;

	return make_node(
		{
			hName: 'label',
			hProperties: {
				className: 'codeblock-tab',
				id: `${id}-tab`,
				role: 'tab',
				for: id,
				'aria-controls': `${id}-tabpanel`,
			},
			children: [
				make_node(
					{
						hName: 'input',
						hProperties: {
							className: 'codeblock-tab-selected sr-only',
							type: 'radio',
							name: groupId,
							id,
							checked,
						},
					},
					context,
				),
				make_title_node({ text: title, fileIconClasses }, context),
			],
		},
		context,
	);
}
