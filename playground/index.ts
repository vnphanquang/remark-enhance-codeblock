import { fileURLToPath } from 'node:url';

import dedent from 'dedent';
import { Hono } from 'hono';
import rehypeStringify from 'rehype-stringify';
import remarkCodeblockSource from 'remark-codeblock-source';
import { fs } from 'remark-codeblock-source/resolvers';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFile } from 'vfile';

// eslint-disable-next-line import-x/default
import script from '../src/client.js?url';
import { remarkEnhanceCodeblock } from '../src/plugin';
import style from '../src/styles/all.css?url';

import md from './input.md?raw';

const html = dedent;

const app = new Hono();

app.get('/', async (c) => {
	const transformed = await unified()
		.use(remarkParse)
		.use(remarkCodeblockSource, {
			resolvers: {
				fs: fs(),
			},
		})
		.use(remarkEnhanceCodeblock)
		.use(remarkRehype)
		.use(rehypeStringify)
		.process(
			new VFile({
				path: fileURLToPath(import.meta.url),
				value: md,
			}),
		);
	const doc = html`
	<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="stylesheet" href="${style}" />

				<script type="importmap">
					{
						"imports": {
							"remark-enhance-codeblock": "${script}"
						}
					}
				</script>

				<script type="module">
					import { enhanceCodeblock } from 'remark-enhance-codeblock';
					enhanceCodeblock();
				</script>

				<style>
					:root {
						color-scheme: light dark;
						background-color: light-dark(white, black);
						color: light-dark(black, white);
					}

					main {
						max-width: 80ch;
						margin-inline: auto;
					}
				</style>
			</head>
			<body>
				<main>${transformed}</main>
			</body>
		</html>
	`;
	return c.html(doc);
});

export default app;
