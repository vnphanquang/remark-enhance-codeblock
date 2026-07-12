import type { Blockquote } from 'mdast';

import type {
	RemarkEnhanceCodeblockOptions,
	RemarkEnhanceCodeblockTrimStrategy,
} from './types.public';

export type DeepRequired<T> = {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	[K in keyof T]-?: T[K] extends Function
		? T[K]
		: T[K] extends object | undefined
			? DeepRequired<Required<T[K]>>
			: T[K];
};

export type ResolvedOptions = DeepRequired<RemarkEnhanceCodeblockOptions>;

/**
 * `null`: not specified, use default behavior
 * `true`: explicitly instructed to show file icon
 * `false`: explicitly instructed to hide file icon
 */
export type FileIconSpecifier = boolean | null;
export type Lang = string | null | undefined;

export type InternalMetaAttributes = {
	trim: RemarkEnhanceCodeblockTrimStrategy | null;
	title: string | null;
	fileIcon: FileIconSpecifier;
};

export interface GroupTabContext {
	id: string;
	title: string | null;
	fileIcon: FileIconSpecifier;
	lang: Lang;
}

export interface GroupContext {
	id: string;
	fileIcon: FileIconSpecifier;
	tabs: GroupTabContext[];
}

export type GroupMapping = Map<Blockquote, GroupContext>;
