import { make_icon_node } from '../make-icon-node';
import { make_node } from '../make-node';

/**
 * @typedef MakeFullscreenActionNodeInput
 * @property {import('../../../types.private').ResolvedOptions['intl']['fullscreen']} intl
 * @property {import('../../../types.private').ResolvedOptions['iconClasses']['fullscreen']} iconClasses
 */

/**
 * @param {MakeFullscreenActionNodeInput} input
 * @param {import('../make-node').MakeNodeContext} context
 * @returns {import('unist').Node}
 */
export function make_fullscreen_action_node(input, context) {
	const { intl, iconClasses } = input;
	return make_node(
		{
			hName: 'button',
			hProperties: {
				className: 'codeblock-action codeblock-fullscreen',
				'aria-label': intl.open,
				'data-open-label': intl.open,
				'data-exit-label': intl.exit,
			},
			children: [
				make_icon_node(
					{
						className: iconClasses.open,
						'data-open-class': iconClasses.open,
						'data-exit-class': iconClasses.exit,
					},
					context,
				),
			],
		},
		context,
	);
}
