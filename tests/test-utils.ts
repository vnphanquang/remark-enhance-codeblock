/* eslint-disable @typescript-eslint/no-explicit-any */
import dedent from 'dedent';
import { toHtml } from 'hast-util-to-html';
import type { Code, Root } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toHast } from 'mdast-util-to-hast';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { parseAttributesFromMeta } from 'remark-transform-blockquote/meta';
import { unified } from 'unified';
import type { Transformer } from 'unified';
import type { Node as UnistNode } from 'unist';
import { u } from 'unist-builder';
import { select } from 'unist-util-select';
import { VFile } from 'vfile';
import { expect } from 'vitest';

import { DEFAULT_OPTIONS } from '../src/internals/resolve-options';
import { remarkEnhanceCodeblock } from '../src/plugin';
import type { RemarkEnhanceCodeblockOptions } from '../src/types.public';

export const markdown = dedent;
export const html = dedent;
export const js = dedent;

export function collapseHtmlString(str: string) {
	return (
		str
			.trim()
			// collapse newline
			.replace(/\r?\n/g, ' ')
			// collapse multiple whitespace into one
			.replace(/\s+/g, ' ')
			// remove whitespace between tags
			.replace(/>\s+</g, '><')
			// replace self closing /> with >
			.replace(/\/>/g, '>')
			// remove whitespace between attributes and closing >
			.replace(/\s+>/g, '>')
			// remove whitespace between tags and text
			.replace(/>\s+([^<]+)\s+</g, '>$1<')
	);
}

export function matchStringIgnoringWhitespace(actual: string, expected: string) {
	expect(collapseHtmlString(actual)).toBe(collapseHtmlString(expected));
}

export async function processWithPlugin(
	input: string | VFile,
	options?: RemarkEnhanceCodeblockOptions,
) {
	const output = await unified()
		.use(remarkParse)
		.use(remarkEnhanceCodeblock, options)
		.use(remarkRehype)
		.use(rehypeStringify)
		.process(input);
	return String(output);
}

export async function getMdastFromMarkdownString(markdown: string): Promise<Root> {
	let mdast: Root | null = null;
	await unified()
		.use(remarkParse)
		.use(
			() =>
				function (tree) {
					mdast = tree;
				} as Transformer<Root, Root>,
		)
		.use(remarkRehype)
		.use(rehypeStringify)
		.process(markdown);
	if (!mdast) {
		throw new Error('');
	}
	return mdast;
}

export function parseFirstCodeNode(tree: Root) {
	const code = select('code', tree) as Code;
	return { code, metaAttributes: parseAttributesFromMeta(code.meta ?? '') };
}

export function mdast2html(node: UnistNode): string {
	const mdast = u('root', [node]);
	const hast = toHast(mdast as any);
	const html = toHtml(hast as any);
	return html;
}

export function markdown2hast(markdown: string, options?: RemarkEnhanceCodeblockOptions) {
	const mdast = fromMarkdown(markdown);
	remarkEnhanceCodeblock(options)(mdast as any, new VFile(), () => {});
	return toHast(mdast);
}

export function mdast2hast(node: UnistNode) {
	return toHast(u('root', [node]) as any);
}

export const COMMON_ACTION_COPY_HTML = html`
	<button
		class="codeblock-action codeblock-copy"
		aria-label="${DEFAULT_OPTIONS.intl.copy.default}"
		data-copied-label="${DEFAULT_OPTIONS.intl.copy.copied}"
	>
		<i
			class="${DEFAULT_OPTIONS.iconClasses.copy.default}"
			data-copied-class="${DEFAULT_OPTIONS.iconClasses.copy.copied}"
		></i>
	</button>
`;
export const COMMON_ACTION_FULLSCREEN_HTML = html`
	<button
		class="codeblock-action codeblock-fullscreen"
		aria-label="${DEFAULT_OPTIONS.intl.fullscreen.open}"
		data-open-label="${DEFAULT_OPTIONS.intl.fullscreen.open}"
		data-exit-label="${DEFAULT_OPTIONS.intl.fullscreen.exit}"
	>
		<i
			class="${DEFAULT_OPTIONS.iconClasses.fullscreen.open}"
			data-open-class="${DEFAULT_OPTIONS.iconClasses.fullscreen.open}"
			data-exit-class="${DEFAULT_OPTIONS.iconClasses.fullscreen.exit}"
		></i>
	</button>
`;
export const COMMON_ACTION_COLLAPSE_HTML = html`
	<label
		class="codeblock-action codeblock-collapse"
		aria-label="${DEFAULT_OPTIONS.intl.collapse}"
	>
		<input class="sr-only" type="checkbox" role="switch" />
		<i class="${DEFAULT_OPTIONS.iconClasses.collapse}"></i>
	</label>
`;
export const COMMON_ACTIONS_HTML = html`
	<div class="codeblock-actions">
		${COMMON_ACTION_COPY_HTML} ${COMMON_ACTION_FULLSCREEN_HTML} ${COMMON_ACTION_COLLAPSE_HTML}
	</div>
`;

export async function assertIconByClassName(scopeClass: string, iconClasses: string) {
	const classSelector = iconClasses
		.split(' ')
		.filter(Boolean)
		.map((cls) => `.${cls}`)
		.join('');
	await expect
		.poll(() =>
			document.querySelector(
				`${scopeClass.startsWith('.') ? scopeClass : `.${scopeClass}`} i${classSelector}`,
			),
		)
		.toBeTruthy();
}

export function normaliseNewline(str: string): string {
	return str.replace(/\r\n|\r/g, '\n');
}
