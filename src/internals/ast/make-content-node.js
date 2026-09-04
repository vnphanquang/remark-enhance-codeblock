import { make_lang_node } from './make-lang-node.js';
import { make_node } from './make-node.js';

/**
 * @typedef MakeContentNodeInput
 * @property {import('mdast').Code} code
 * @property {string | false} [tabId]
 */

/**
 * @param {MakeContentNodeInput} input
 * @param {import('./make-node').MakeNodeContext} context
 * @returns {ReturnType<typeof make_node>}
 */
export function make_content_node(input, context) {
	const { code, tabId } = input;
	return make_node(
		{
			hName: 'div',
			hProperties: {
				className: 'codeblock-content',
				...(tabId && {
					id: `${tabId}-tabpanel`,
					role: 'tabpanel',
					tabindex: 0,
					'aria-labelledby': `${tabId}-tab`,
				}),
			},
			children: [make_lang_node(code.lang, context), code],
		},
		context,
	);
}
