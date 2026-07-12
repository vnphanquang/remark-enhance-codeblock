/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test } from 'vitest';

import type { RemarkEnhanceCodeblockTrimStrategy } from '../../src';
import { DEFAULT_OPTIONS, resolve_options } from '../../src/internals/resolve-options';

function flatten(obj: Record<string, any>, prefix = '') {
	return Object.keys(obj).reduce(
		(acc, k) => {
			const pre = prefix ? `${prefix}.${k}` : k;
			if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
				Object.assign(acc, flatten(obj[k], pre));
			} else {
				acc[pre] = obj[k];
			}
			return acc;
		},
		{} as Record<string, any>,
	);
}

const FLATTEN_DEFAULT_OPTIONS = flatten(DEFAULT_OPTIONS);

test('fallback to defaults if no options are provided', () => {
	expect(resolve_options()).toBe(DEFAULT_OPTIONS);
	expect(resolve_options({})).toBe(DEFAULT_OPTIONS);
});

test('default iconClasses.file should work per lang', () => {
	const file = DEFAULT_OPTIONS.iconClasses.file;
	expect(file('js')).toBe('i i-file i-file-js');
	expect(file()).toBe('i i-file');
	expect(file(null)).toBe('i i-file');
});

test('can specify nodeType', () => {
	const nodeType = 'div';
	const options = resolve_options({ nodeType });
	expect(flatten(options)).toEqual({ ...FLATTEN_DEFAULT_OPTIONS, nodeType });
});

test('can specify groupBlockquoteMarker', () => {
	const groupBlockquoteMarker = '!CUSTOM' as const;
	const options = resolve_options({ groupBlockquoteMarker });
	expect(flatten(options)).toEqual({ ...FLATTEN_DEFAULT_OPTIONS, groupBlockquoteMarker });
});

test('can specify trim', () => {
	const trim: RemarkEnhanceCodeblockTrimStrategy = 'none';
	const options = resolve_options({ trim });
	expect(flatten(options)).toEqual({ ...FLATTEN_DEFAULT_OPTIONS, trim });
});

test('can specify intl.copy.default', () => {
	const value = 'Custom Copy';
	const options = resolve_options({ intl: { copy: { default: value } } });
	expect(flatten(options)).toEqual({ ...FLATTEN_DEFAULT_OPTIONS, 'intl.copy.default': value });
});

test('can specify intl.copy.copied', () => {
	const value = 'Custom Copied';
	const options = resolve_options({ intl: { copy: { copied: value } } });
	expect(flatten(options)).toEqual({ ...FLATTEN_DEFAULT_OPTIONS, 'intl.copy.copied': value });
});

test('can specify intl.fullscreen.open', () => {
	const value = 'Custom Open';
	const options = resolve_options({ intl: { fullscreen: { open: value } } });
	expect(flatten(options)).toEqual({ ...FLATTEN_DEFAULT_OPTIONS, 'intl.fullscreen.open': value });
});

test('can specify intl.fullscreen.exit', () => {
	const value = 'Custom Exit';
	const options = resolve_options({ intl: { fullscreen: { exit: value } } });
	expect(flatten(options)).toEqual({ ...FLATTEN_DEFAULT_OPTIONS, 'intl.fullscreen.exit': value });
});

test('can specify intl.collapse', () => {
	const value = 'Custom Collapse';
	const options = resolve_options({ intl: { collapse: value } });
	expect(flatten(options)).toEqual({ ...FLATTEN_DEFAULT_OPTIONS, 'intl.collapse': value });
});

test('can specify iconClasses.copy.default', () => {
	const value = 'custom-copy-class';
	const options = resolve_options({ iconClasses: { copy: { default: value } } });
	expect(flatten(options)).toEqual({
		...FLATTEN_DEFAULT_OPTIONS,
		'iconClasses.copy.default': value,
	});
});

test('can specify iconClasses.copy.copied', () => {
	const value = 'custom-copy-class';
	const options = resolve_options({ iconClasses: { copy: { copied: value } } });
	expect(flatten(options)).toEqual({
		...FLATTEN_DEFAULT_OPTIONS,
		'iconClasses.copy.copied': value,
	});
});

test('can specify iconClasses.fullscreen.open', () => {
	const value = 'custom-fullscreen-open-class';
	const options = resolve_options({ iconClasses: { fullscreen: { open: value } } });
	expect(flatten(options)).toEqual({
		...FLATTEN_DEFAULT_OPTIONS,
		'iconClasses.fullscreen.open': value,
	});
});

test('can specify iconClasses.fullscreen.exit', () => {
	const value = 'custom-fullscreen-exit-class';
	const options = resolve_options({ iconClasses: { fullscreen: { exit: value } } });
	expect(flatten(options)).toEqual({
		...FLATTEN_DEFAULT_OPTIONS,
		'iconClasses.fullscreen.exit': value,
	});
});

test('can specify iconClasses.collapse', () => {
	const value = 'custom-collapse-class';
	const options = resolve_options({ iconClasses: { collapse: value } });
	expect(flatten(options)).toEqual({
		...FLATTEN_DEFAULT_OPTIONS,
		'iconClasses.collapse': value,
	});
});

test('can specify iconClasses.file', () => {
	const value = () => 'custom';
	const options = resolve_options({ iconClasses: { file: value } });
	expect(flatten(options)).toEqual({
		...FLATTEN_DEFAULT_OPTIONS,
		'iconClasses.file': value,
	});
});
