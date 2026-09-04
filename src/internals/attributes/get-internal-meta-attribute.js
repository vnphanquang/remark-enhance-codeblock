import { InvalidMetaAttributeValueError } from '../../errors.js';

/**
 * @template {string} A
 * @overload
 * @param {Record<string, import('remark-transform-blockquote').MetaAttribute> | undefined} attributes
 * @param {string} name
 * @param {'string'} type
 * @param {ReadonlyArray<A>} [allowlist]
 * @returns {(Omit<import('remark-transform-blockquote').MetaStringAttribute, 'value'> & { value: A }) | null}
 */
/**
 * @overload
 * @param {Record<string, import('remark-transform-blockquote').MetaAttribute> | undefined} attributes
 * @param {string} name
 * @param {'boolean'} type
 * @returns {import('remark-transform-blockquote').MetaBooleanAttribute | null}
 */
/**
 * @template {'string' | 'boolean'} T
 * @template {string} A
 * @param {Record<string, import('remark-transform-blockquote').MetaAttribute> | undefined} attributes
 * @param {string} name
 * @param {T} type
 * @param {T extends 'string' ? ReadonlyArray<A> : undefined} [allowlist]
 * @returns {Extract<import('remark-transform-blockquote').MetaAttribute, { type: T }> | null}
 */
export function get_internal_meta_attribute(attributes, name, type, allowlist) {
	if (!attributes) return null;
	if (!attributes[name] || attributes[name].type !== type || attributes[name].merge) return null;
	const attribute =
		/** @type {Extract<import('remark-transform-blockquote').MetaAttribute, { type: T }>} */ (
			attributes[name]
		);
	if (
		attribute.type === 'string' &&
		allowlist &&
		!allowlist.includes(/** @type {A} */ (attribute.value))
	) {
		throw new InvalidMetaAttributeValueError(name, /** @type {A} */ (attribute.value), allowlist);
	}
	return attribute;
}
