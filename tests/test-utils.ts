import dedent from 'dedent';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { VFile } from 'vfile';
import { expect } from 'vitest';

import { remarkEnhanceCodeblock } from '../src/plugin';
import type { RemarkEnhanceCodeblockOptions } from '../src/types.public';

export const markdown = dedent;
export const html = dedent;

export function matchStringIgnoringWhitespace(actual: string, expected: string) {
	// collapse newline
	const normalize = (str: string) =>
		str.trim().replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').replace(/>\s+</g, '><'); // remove whitespace between tags
	expect(normalize(actual)).toBe(normalize(expected));
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
