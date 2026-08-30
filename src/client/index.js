import { enhanceCopy } from './features/copy.js';
import { enhanceFullscreen } from './features/fullscreen.js';
import { enhanceTabs } from './features/tabs.js';

/**
 * @typedef EnhanceCodeBlockOptions
 * @property {import("./features/copy").EnhanceCodeBlockCopyOptions} [copy]
 */

/**
 * attach event listeners to code blocks for progressively-enhanced functionalities
 * @param {EnhanceCodeBlockOptions} [options]
 * @returns {void}
 */
export function enhanceCodeblock(options) {
	enhanceTabs();
	enhanceCopy(options?.copy);
	enhanceFullscreen();

	// Mark code blocks as enhanced so that JS-dependent elements are visible
	const codeblocks = /** @type {NodeListOf<HTMLElement>} */ (
		document.querySelectorAll('.codeblock')
	);
	for (const block of codeblocks) {
		const root = /** @type {HTMLElement | null}  */ (block.closest('.codeblock-root'));
		root?.classList.add('enhanced');
	}
}
