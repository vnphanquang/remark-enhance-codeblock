import { visit } from 'unist-util-visit';

/**
 * @param {import('./types.public').RemarkEnhanceCodeblockOptions} [options] - configure the plugin behavior
 * @returns {import('unified').Transformer<import('mdast').Root, import('mdast').Root>}
 */
export function remarkEnhanceCodeblock(options) {
	return async function (tree) {
		visit(tree, 'code', (node) => {
			console.log(node, options);
		});
	};
}
