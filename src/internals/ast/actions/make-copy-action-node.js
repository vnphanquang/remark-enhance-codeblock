import { make_icon_node } from '../make-icon-node';
import { make_node } from '../make-node';

/**
 * @typedef MakeCopyActionNodeInput
 * @property {import('../../../types.private').ResolvedOptions['intl']['copy']} intl
 * @property {import('../../../types.private').ResolvedOptions['iconClasses']['copy']} iconClasses
 */

/**
 * @param {MakeCopyActionNodeInput} input
 * @param {import('../make-node').MakeNodeContext} context
 * @returns {import('unist').Node}
 */
export function make_copy_action_node(input, context) {
	const { intl, iconClasses } = input;
	return make_node(
		{
			hName: 'button',
			hProperties: {
				className: 'codeblock-action codeblock-copy',
				'aria-label': intl.default,
				'data-copied-label': intl.copied,
			},
			children: [
				make_icon_node(
					{
						className: iconClasses.default,
						'data-copied-class': iconClasses.copied,
					},
					context,
				),
			],
		},
		context,
	);
}
