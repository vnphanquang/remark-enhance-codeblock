import { make_actions_node } from './actions/make-actions-node.js';
import { make_content_node } from './make-content-node.js';
import { make_header_node } from './make-header-node.js';
import { make_node } from './make-node.js';

/**
 * @typedef MakeStandaloneBlockNodeInput
 * @property {'standalone'} variant
 * @property {string | null} title
 * @property {boolean} fileIcon
 * @property {import('../../types.private.js').ResolvedOptions['intl']} intl
 * @property {import('../../types.private.js').ResolvedOptions['iconClasses']} iconClasses
 * @property {import('mdast').Code} code
 */

/**
 * @typedef MakeGroupBlockNodeInput
 * @property {'group'} variant
 * @property {string} [tabId]
 * @property {import('mdast').Code} code
 */

/**
 * @param {MakeStandaloneBlockNodeInput | MakeGroupBlockNodeInput} input
 * @param {import('./make-node').MakeNodeContext} context
 * @returns {ReturnType<typeof make_node>}
 */
export function make_block_node(input, context) {
	const block = make_node(
		{
			hName: 'div',
			hProperties: {
				className: `codeblock${input.variant === 'standalone' ? ' codeblock-root' : ''}`,
				'data-oneliner': input.code.value.trim().split('\n').length === 1,
			},
			children:
				input.variant === 'standalone'
					? [
							make_header_node(
								{
									variant: input.variant,
									title: input.title,
									lang: input.code.lang,
									fileIcon: input.fileIcon,
									intl: input.intl,
									iconClasses: input.iconClasses,
								},
								context,
							),
							!input.title &&
								make_actions_node(
									{
										intl: input.intl,
										iconClasses: input.iconClasses,
									},
									context,
								),
							make_content_node({ code: input.code }, context),
						]
					: [make_content_node({ code: input.code, tabId: input.tabId }, context)],
		},
		context,
	);
	return block;
}
