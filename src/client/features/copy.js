/**
 * @typedef EnhanceCodeBlockCopyContext
 * @property {HTMLPreElement} pre `pre` element of the associated code block, in group this is the currently selected one
 * @property {HTMLButtonElement} btn `button` element that was clicked to trigger the copy action
 */

/**
 * @callback EnhanceCodeBlockCopyFn
 * @param {EnhanceCodeBlockCopyContext} context relevant information for determining what text to copy
 * @returns {string | null | undefined | false | void} a string to pass to `navigator.clipboard.writeText()`,
 * or any falsy value if implementing custom copy logic (e.g. use the legacy `execCommand('copy')` method)
 */

/**
 * @typedef EnhanceCodeBlockCopyOptions
 * @property {EnhanceCodeBlockCopyFn} [fn]  instruction on what text to copy
 * @property {number} [timeoutMs] how long to show the "copied" state before reverting back to the default state, in milliseconds
 */

/**
 * @typedef CopyOp
 * @property {ReturnType<typeof setTimeout>} timeoutId
 * @property {string[]} copiedClasses
 * @property {string} copyLabel
 */
/** @type {WeakMap<HTMLElement, CopyOp>} */
const copyTimeoutMap = new WeakMap();

/** @type {EnhanceCodeBlockCopyOptions | null} */
let userOptions = null;

/** @type {EnhanceCodeBlockCopyFn} */
const defaultCopy = function ({ pre }) {
	return pre.textContent;
};

/** @param {Event} event */
function handleCopy(event) {
	const target = /** @type {HTMLButtonElement} */ (event.currentTarget);

	let lastCopyOp = copyTimeoutMap.get(target);
	if (lastCopyOp) {
		clearTimeout(lastCopyOp.timeoutId);
	}

	const copyLabel = target.getAttribute('aria-label') ?? 'Copy';
	const copiedLabel = target.dataset.copiedLabel ?? 'Copied';
	const icon = /** @type {HTMLElement} */ (target.firstElementChild);
	const copiedClasses = (icon.dataset.copiedClass ?? '')
		.split(' ')
		.filter(Boolean)
		.filter((cls) => !icon.classList.contains(cls));

	if (!lastCopyOp) {
		target.setAttribute('aria-label', copiedLabel);
		for (const cls of copiedClasses) {
			icon.classList.toggle(cls, true);
		}
	}

	const root = /** @type {HTMLElement} */ (target.closest('.codeblock-root'));
	const pre = /** @type {HTMLPreElement} */ (
		root.querySelector('.codeblock-content.opened pre') ?? root.querySelector('pre')
	);
	const copyFn = userOptions?.fn ?? defaultCopy;
	const textToCopy = copyFn({ pre, btn: target });
	if (textToCopy) {
		navigator.clipboard.writeText(textToCopy);
	}

	copyTimeoutMap.set(target, {
		copiedClasses: lastCopyOp?.copiedClasses ?? copiedClasses,
		copyLabel: lastCopyOp?.copyLabel ?? copyLabel,
		timeoutId: setTimeout(() => {
			const { copiedClasses, copyLabel } = /** @type {CopyOp} */ (copyTimeoutMap.get(target));
			target.setAttribute('aria-label', copyLabel);
			for (const cls of copiedClasses) {
				icon.classList.toggle(cls, false);
			}
			copyTimeoutMap.delete(target);
		}, userOptions?.timeoutMs ?? 3000),
	});
}

/**
 * @param {EnhanceCodeBlockCopyOptions} [options]
 */
export function enhanceCopy(options) {
	userOptions = options ?? null;
	const btns = /** @type {NodeListOf<HTMLButtonElement>} */ (
		document.querySelectorAll('.codeblock-copy')
	);
	for (const btn of btns) {
		btn.addEventListener('click', handleCopy);
	}
}
