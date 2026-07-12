/* eslint-disable jsdoc/reject-any-type */

import { u } from 'unist-builder';

/**
 * @typedef MakeNodeInput
 * @property {string} hName
 * @property {Record<string, any>} [hProperties]
 * @property {Array<import('unist').Node | null | undefined | false | ''>} [children]
 */

/**
 * @typedef MakeNodeContext
 * @property {string} type
 */

/**
 * @param {MakeNodeInput} input
 * @param {MakeNodeContext} context
 * @returns {Omit<import('unist').Parent, 'data'> & { data: { hName: string; hProperties: Record<string, string | boolean> } }}
 */
export function make_node(input, context) {
	const { hName, hProperties = {}, children = [] } = input;
	const { type } = context;

	return u(
		type,
		{
			data: {
				hName,
				hProperties,
				type,
			},
		},
		/** @type {import('unist').Node[]} */ (children.filter(Boolean)),
	);
}
