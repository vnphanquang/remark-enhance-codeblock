import { test } from 'vitest';

import { make_collapse_action_node } from '../../../../src/internals/ast/actions/make-collapse-action-node';
import type { MakeNodeContext } from '../../../../src/internals/ast/make-node';
import { DEFAULT_OPTIONS } from '../../../../src/internals/resolve-options';
import {
	COMMON_ACTION_COLLAPSE_HTML,
	matchStringIgnoringWhitespace,
	mdast2html,
} from '../../../test-utils';

const make_node_context: MakeNodeContext = { type: 'custom' };

test('output to correct html structure', () => {
	const node = make_collapse_action_node(
		{
			intl: DEFAULT_OPTIONS.intl.collapse,
			iconClasses: DEFAULT_OPTIONS.iconClasses.collapse,
		},
		make_node_context,
	);
	const str = mdast2html(node);
	matchStringIgnoringWhitespace(str, COMMON_ACTION_COLLAPSE_HTML);
});
