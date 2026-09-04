import { make_node } from './make-node.js';

/**
 * @template V
 * @param {Record<string, V>} hProperties
 * @param {import('./make-node').MakeNodeContext} context
 * @returns {import('unist').Node}
 */
export function make_icon_node(hProperties, context) {
	return make_node(
		{
			hName: 'i',
			hProperties,
		},
		context,
	);
}
