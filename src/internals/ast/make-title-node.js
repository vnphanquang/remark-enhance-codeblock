import { u } from 'unist-builder';

import { make_icon_node } from './make-icon-node.js';
import { make_node } from './make-node.js';

/**
 * @typedef MakeTitleNodeInput
 * @property {string} text
 * @property {string | false | null | undefined} [fileIconClasses]
 */

/**
 * @param {MakeTitleNodeInput} input
 * @param {import('./make-node').MakeNodeContext} context
 * @returns {import('unist').Node}
 */
export function make_title_node(input, context) {
	const { text, fileIconClasses } = input;
	return make_node(
		{
			hName: 'span',
			hProperties: {
				className: 'codeblock-title',
			},
			children: [
				fileIconClasses && make_icon_node({ className: fileIconClasses }, context),
				u('text', text),
			],
		},
		context,
	);
}
