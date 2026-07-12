import { test } from 'vitest';

import { make_actions_node } from '../../../../src/internals/ast/actions/make-actions-node';
import type { MakeNodeContext } from '../../../../src/internals/ast/make-node';
import { DEFAULT_OPTIONS } from '../../../../src/internals/resolve-options';
import {
	COMMON_ACTIONS_HTML,
	matchStringIgnoringWhitespace,
	mdast2html,
} from '../../../test-utils';

const make_node_context: MakeNodeContext = { type: 'custom' };

test('output to correct html structure', () => {
	const node = make_actions_node(
		{
			intl: DEFAULT_OPTIONS.intl,
			iconClasses: DEFAULT_OPTIONS.iconClasses,
		},
		make_node_context,
	);
	const str = mdast2html(node);
	matchStringIgnoringWhitespace(str, COMMON_ACTIONS_HTML);
});
