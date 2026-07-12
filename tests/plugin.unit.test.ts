import { u } from 'unist-builder';
import { VFile } from 'vfile';
import { expect, test } from 'vitest';

import { remarkEnhanceCodeblock } from '../src/plugin';

test("skip if code doesn't live in a typical mdast container", () => {
	const plugin = remarkEnhanceCodeblock();
	const code = u('code', { lang: 'js' }, 'console.log("Hello, world!");');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	plugin(code as any, new VFile(), () => {});
	expect(code).toEqual(code);
});
