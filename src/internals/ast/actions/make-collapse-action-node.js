import { make_icon_node } from '../make-icon-node.js';
import { make_node } from '../make-node.js';

/**
 * @typedef MakeCollapseActionNodeInput
 * @property {import('../../../types.private').ResolvedOptions['intl']['collapse']} intl
 * @property {import('../../../types.private').ResolvedOptions['iconClasses']['collapse']} iconClasses
 */

/**
 * @param {MakeCollapseActionNodeInput} input
 * @param {import('../make-node').MakeNodeContext} context
 * @returns {import('unist').Node}
 */
export function make_collapse_action_node(input, context) {
	const { intl, iconClasses } = input;
	return make_node(
		{
			hName: 'label',
			hProperties: {
				className: 'codeblock-action codeblock-collapse',
				'aria-label': intl,
			},
			children: [
				make_node(
					{
						hName: 'input',
						hProperties: { className: 'sr-only', type: 'checkbox', role: 'switch' },
					},
					context,
				),
				make_icon_node(
					{
						className: iconClasses,
					},
					context,
				),
			],
		},
		context,
	);
}
