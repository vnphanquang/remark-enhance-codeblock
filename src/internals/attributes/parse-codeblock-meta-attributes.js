import { parseAttributesFromMeta } from 'remark-transform-blockquote/meta';

import { get_internal_meta_attribute } from './get-internal-meta-attribute';

export const TRIM_ALLOWLIST = /** @type {const} */(['both', 'start', 'end', 'none']);

/**
 * parse the meta attributes from an individual codeblock, check for supported internal ones
 * @param {import('mdast').Code} node
 * @returns {{ attributes: Record<string, import('remark-transform-blockquote').MetaAttribute>, internals: import('../../types.private').InternalMetaAttributes }}
 */
export function parse_codeblock_meta_attributes(node) {
	const attributes = node.meta ? parseAttributesFromMeta(node.meta) : {};
	const trim = get_internal_meta_attribute(attributes, 'trim', 'string', TRIM_ALLOWLIST);
	const title = get_internal_meta_attribute(attributes, 'title', 'string');
	const fileIcon = get_internal_meta_attribute(attributes, 'file-icon', 'boolean');
	return {
		attributes,
		internals: {
			trim: trim?.value || null,
			title: title?.value || null,
			fileIcon: fileIcon?.value ?? null,
		},
	};
}
