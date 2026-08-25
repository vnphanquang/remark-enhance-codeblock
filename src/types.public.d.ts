export type RemarkEnhanceCodeblockTrimStrategy = 'start' | 'end' | 'both' | 'none';

/**
 * text labels for buttons and switches in `remark-enhance-codeblock`. Even though the
 * typing is permissive (every field is optional), it is recommended to provide all labels for
 * a consistent user experience.
 */
export interface RemarkEnhanceCodeblockIntl {
	copy?: {
		/**
		 * aria-label for the copy button
		 * @default 'Copy'
		 */
		default?: string;
		/**
		 * aria-label for the copy button after code has been copied
		 * @default 'Copied'
		 */
		copied?: string;
	};
	fullscreen?: {
		/**
		 * aria-label for the button that requests fullscreen
		 * @default 'Open fullscreen'
		 */
		open?: string;
		/**
		 * aria-label for the button that exits fullscreen
		 * @default 'Exit fullscreen'
		 */
		exit?: string;
	};
	/**
	 * aria-label for the collapse switch
	 * @default 'Collapse'
	 */
	collapse?: string;
}

export interface RemarkEnhanceCodeblockIconClasses {
	/**
	 * icon class names for the copy button
	 */
	copy?: {
		default?: string;
		copied?: string;
	};
	/**
	 * icon class names for the fullscreen button
	 */
	fullscreen?: {
		/** @default 'i i-corners-out' */
		open?: string;
		/** @default 'i i-corners-in' */
		exit?: string;
	};
	/**
	 * icon class names for the collapse switch
	 * @default 'i i-caret-up'
	 */
	collapse?: string;
	/**
	 * icon class names for language file icon before the title if provided
	 * @default (lang) => `i i-file${lang ? ` i-file-${lang}` : ''}`;
	 */
	file?: (lang?: string | null | undefined) => string | undefined | null;
}

/** configure the behavior of `remark-enhance-codeblock` */
export interface RemarkEnhanceCodeblockOptions {
	/**
	 * whether to trim leading & trailing whitespaces in code blocks
	 * @default 'both'
	 *
	 * alternatively, per-instance behavior can be configured by setting `#trim`
	 */
	trim?: RemarkEnhanceCodeblockTrimStrategy;
	/** internationalisation */
	intl?: RemarkEnhanceCodeblockIntl;
	/**
	 * how to set class names for icon elements;
	 * typically used to customise / provide your own icon SVG-in-CSS / font icon set
	 */
	iconClasses?: RemarkEnhanceCodeblockIconClasses;
	/**
	 * custom marker for group blockquotes that will be passed on to `remark-transform-blockquote`
	 * @default '!CODEGROUP'
	 */
	groupBlockquoteMarker?: `!${string}`;
	/**
	 * the custom `mdast` node type to set for generated nodes,
	 * helpful if you need to to further processing in subsequent remark plugins
	 * @default `enhance-codeblock`
	 */
	nodeType?: string;
}
