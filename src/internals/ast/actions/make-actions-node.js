import { make_node } from '../make-node';

import { make_collapse_action_node } from './make-collapse-action-node';
import { make_copy_action_node } from './make-copy-action-node';
import { make_fullscreen_action_node } from './make-fullscreen-action-node';

/**
 * @typedef MakeActionsNodeInput
 * @property {import('../../../types.private').ResolvedOptions['intl']} intl
 * @property {import('../../../types.private').ResolvedOptions['iconClasses']} iconClasses
 */

/**
 * @param {MakeActionsNodeInput} input
 * @param {import('../make-node').MakeNodeContext} context
 * @returns {import('unist').Parent}
 */
export function make_actions_node(input, context) {
	const { intl, iconClasses } = input;
	return make_node(
		{
			hName: 'div',
			hProperties: {
				className: 'codeblock-actions',
			},
			children: [
				make_copy_action_node(
					{
						intl: intl.copy,
						iconClasses: iconClasses.copy,
					},
					context,
				),
				make_fullscreen_action_node(
					{
						intl: intl.fullscreen,
						iconClasses: iconClasses.fullscreen,
					},
					context,
				),
				make_collapse_action_node(
					{
						intl: intl.collapse,
						iconClasses: iconClasses.collapse,
					},
					context,
				),
			],
		},
		context,
	);
}
