import { expect, test } from 'vitest';

import { make_icon_node } from '../../../src/internals/ast/make-icon-node';
import type { MakeNodeContext } from '../../../src/internals/ast/make-node';
import { html, mdast2html } from '../../test-utils';

const make_node_context: MakeNodeContext = { type: 'custom' };

test('output to correct html structure', () => {
	const node = make_icon_node({ className: 'i i-name' }, make_node_context);
	expect(mdast2html(node)).toBe(html`<i class="i i-name"></i>`);
});
