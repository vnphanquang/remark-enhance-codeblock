import { make_node } from '../make-node';

import { make_tab_node } from './make-tab-node';

/**
 * @param {import('./make-tab-node').MakeTabNodeInput[]} input
 * @param {import('../make-node').MakeNodeContext} context
 * @returns {import('unist').Parent}
 */
export function make_tablist_node(input, context) {
	return make_node(
		{
			hName: 'div',
			hProperties: {
				role: 'tablist',
				className: 'codeblock-tabs',
			},
			children: input.map((tab) => make_tab_node(tab, context)),
		},
		context,
	);
}
