import { u } from 'unist-builder';

import { make_node } from './make-node';

/**
 * @param {import('../../types.private').Lang} lang
 * @param {import('./make-node').MakeNodeContext} context
 * @returns {import('unist').Node | null}
 */
export function make_lang_node(lang, context) {
	return lang
		? make_node(
				{
					hName: 'span',
					hProperties: {
						className: 'codeblock-lang',
					},
					children: [u('text', lang)],
				},
				context,
			)
		: null;
}
