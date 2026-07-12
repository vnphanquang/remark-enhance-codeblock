import { test } from 'vitest';

import { make_fullscreen_action_node } from '../../../../src/internals/ast/actions/make-fullscreen-action-node';
import type { MakeNodeContext } from '../../../../src/internals/ast/make-node';
import { DEFAULT_OPTIONS } from '../../../../src/internals/resolve-options';
import {
	COMMON_ACTION_FULLSCREEN_HTML,
	matchStringIgnoringWhitespace,
	mdast2html,
} from '../../../test-utils';

const make_node_context: MakeNodeContext = { type: 'custom' };

test('output to correct html structure', () => {
	const node = make_fullscreen_action_node(
		{
			intl: DEFAULT_OPTIONS.intl.fullscreen,
			iconClasses: DEFAULT_OPTIONS.iconClasses.fullscreen,
		},
		make_node_context,
	);
	const str = mdast2html(node);
	matchStringIgnoringWhitespace(str, COMMON_ACTION_FULLSCREEN_HTML);
});
