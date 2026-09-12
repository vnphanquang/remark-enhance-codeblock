export const DEFAULT_OPTIONS = /** @type {import('../types.private').ResolvedOptions} */ ({
	nodeType: 'enhance-codeblock',
	groupBlockquoteMarker: '!CODEGROUP',
	trim: 'both',
	intl: {
		copy: {
			default: 'Copy',
			copied: 'Copied',
		},
		fullscreen: {
			open: 'Open fullscreen',
			exit: 'Exit fullscreen',
		},
		collapse: 'Collapse',
	},
	iconClasses: {
		copy: {
			default: 'i i-clipboard',
			copied: 'i i-clipboard-text',
		},
		fullscreen: {
			open: 'i i-corners-out',
			exit: 'i i-corners-in',
		},
		collapse: 'i i-caret-up',
		/**
		 *	@param {string | undefined | null} [lang]
		 *	@returns {string}
		 */
		file(lang) {
			return `i i-file${lang ? ` i-file-${lang}` : ''}`;
		},
	},
});

/**
 * @param {import('../types.public').RemarkEnhanceCodeblockOptions} [options] - configure the plugin behavior
 * @returns {Omit<import('../types.private').ResolvedOptions, 'intl'>}
 */
export function resolve_options(options = {}) {
	if (!options || Object.keys(options).length === 0) {
		return DEFAULT_OPTIONS;
	}
	return {
		nodeType: options?.nodeType || DEFAULT_OPTIONS.nodeType,
		groupBlockquoteMarker: options.groupBlockquoteMarker || DEFAULT_OPTIONS.groupBlockquoteMarker,
		trim: options.trim || DEFAULT_OPTIONS.trim,
		iconClasses: {
			copy: {
				default: options?.iconClasses?.copy?.default || DEFAULT_OPTIONS.iconClasses.copy.default,
				copied: options?.iconClasses?.copy?.copied || DEFAULT_OPTIONS.iconClasses.copy.copied,
			},
			fullscreen: {
				open: options?.iconClasses?.fullscreen?.open || DEFAULT_OPTIONS.iconClasses.fullscreen.open,
				exit: options?.iconClasses?.fullscreen?.exit || DEFAULT_OPTIONS.iconClasses.fullscreen.exit,
			},
			collapse: options?.iconClasses?.collapse || DEFAULT_OPTIONS.iconClasses.collapse,
			file: options?.iconClasses?.file || DEFAULT_OPTIONS.iconClasses.file,
		},
	};
}

/**
 * @param {{ locale?: string; filename?: string }} context
 * @param {import('../types.public').RemarkEnhanceCodeblockIntl} [intl]
 * @returns {import('../types.private').ResolvedOptions['intl']}
 */
export function resolve_intl(context, intl) {
	const specs = typeof intl === 'function' ? intl(context) : intl;

	if (!specs) return DEFAULT_OPTIONS.intl;

	return {
		copy: {
			default: specs.copy?.default || DEFAULT_OPTIONS.intl.copy.default,
			copied: specs.copy?.copied || DEFAULT_OPTIONS.intl.copy.copied,
		},
		fullscreen: {
			open: specs.fullscreen?.open || DEFAULT_OPTIONS.intl.fullscreen.open,
			exit: specs.fullscreen?.exit || DEFAULT_OPTIONS.intl.fullscreen.exit,
		},
		collapse: specs.collapse || DEFAULT_OPTIONS.intl.collapse,
	};
}
