import { remarkTransformBlockquote } from 'remark-transform-blockquote';
import { mergeMetaAttributes } from 'remark-transform-blockquote/meta';
import { SKIP, visit } from 'unist-util-visit';

import { make_block_node } from './internals/ast/make-block-node.js';
import { make_header_node } from './internals/ast/make-header-node.js';
import { get_internal_meta_attribute } from './internals/attributes/get-internal-meta-attribute.js';
import { parse_codeblock_meta_attributes } from './internals/attributes/parse-codeblock-meta-attributes.js';
import { create_id } from './internals/create-id.js';
import { resolve_options } from './internals/resolve-options.js';

/**
 * @type {import('unified').Plugin<[import('./types.public').RemarkEnhanceCodeblockOptions?], import('mdast').Root>}
 */
export function remarkEnhanceCodeblock(options = {}) {
	const o = resolve_options(options);
	const astMakeContext = { type: o.nodeType };

	return function (tree, file, next) {
		/** @type {import('./types.private').GroupMapping} */
		const groupMap = new Map();

		// 1. Process code groups first, if any
		const transformCodeGroupNode = remarkTransformBlockquote({
			mappings: [
				{
					marker: o.groupBlockquoteMarker,
					tag: 'div',
					attributes: {
						className: 'codeblock-group codeblock-root',
					},
					hooks: {
						post: ({ node, meta }) => {
							// clear all immediate children that are not of type 'code'
							node.children = node.children.filter((child) => child.type === 'code');

							const fileIcon =
								get_internal_meta_attribute(meta?.attributes, 'file-icon', 'boolean')?.value ??
								null;

							// register this group for later reference
							groupMap.set(node, {
								id: create_id(),
								tabs: [],
								fileIcon,
							});
						},
					},
				},
			],
			meta: true,
		});
		transformCodeGroupNode(tree, file, next);

		// 2. Process all individual codeblocks, whether grouped or not
		visit(tree, 'code', (node, index, parent) => {
			if (index === undefined || !parent) return;

			const { attributes, internals } = parse_codeblock_meta_attributes(node);

			const trim = internals?.trim || o.trim;
			switch (trim) {
				case 'start':
					node.value = node.value.trimStart();
					break;
				case 'end':
					node.value = node.value.trimEnd();
					break;
				case 'both':
					node.value = node.value.trim();
					break;
			}

			const group = groupMap.get(/** @type {import('mdast').Blockquote} */ (parent));

			/** @type {ReturnType<make_block_node>} */
			let block;
			if (group) {
				const id = create_id();
				block = make_block_node(
					{
						variant: 'group',
						tabId: id,
						code: node,
					},
					astMakeContext,
				);
				group.tabs.push({
					id,
					title: internals.title,
					lang: node.lang,
					fileIcon: internals.fileIcon,
				});
			} else {
				block = make_block_node(
					{
						variant: 'standalone',
						title: internals.title,
						code: node,
						fileIcon: internals.fileIcon ?? true,
						intl: o.intl,
						iconClasses: o.iconClasses,
					},
					astMakeContext,
				);
			}

			mergeMetaAttributes({ attributes, into: block.data.hProperties, inplace: true });

			parent.children.splice(index, 1, /** @type {import('mdast').BlockContent} */ (block));

			return SKIP;
		});

		// 3. Loop back all groups, add headers
		for (const [group, groupContext] of groupMap.entries()) {
			const header = make_header_node(
				{
					variant: 'group',
					group: groupContext,
					intl: o.intl,
					iconClasses: o.iconClasses,
				},
				astMakeContext,
			);
			group.children.unshift(/** @type {import('mdast').BlockContent} */ (header));
		}

		return next();
	};
}
