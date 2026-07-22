/** @type {EnhanceCodeBlockOptions | undefined} */
let userOptions = undefined;

/**
 * @typedef CopyOp
 * @property {ReturnType<typeof setTimeout>} timeoutId
 * @property {string[]} copiedClasses
 * @property {string} copyLabel
 */
/** @type {WeakMap<HTMLElement, CopyOp>} */
const copyTimeoutMap = new WeakMap();

const select = {
	codeblocks: () =>
		/** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.codeblock')),
	tabs: () =>
		/** @type {NodeListOf<HTMLLabelElement>} */ (document.querySelectorAll('.codeblock-tab')),
	copyBtns: () =>
		/** @type {NodeListOf<HTMLButtonElement>} */ (document.querySelectorAll('.codeblock-copy')),
	fullscreenBtns: () =>
		/** @type {NodeListOf<HTMLButtonElement>} */ (
			document.querySelectorAll('.codeblock-fullscreen')
		),
};

const listeners = {
	/** @param {Event} event */
	handleTabChange: function (event) {
		const target = /** @type {HTMLInputElement} */ (event.currentTarget);
		const tabTarget = /** @type {HTMLLabelElement} */ (target.parentElement);

		// per HTML specs `change` event only fires for the radio that was selected in a group, so no
		// need to check for `target.checked` here

		const tabs = select.tabs();
		for (const tab of tabs) {
			const selected = tab.isSameNode(tabTarget);
			tab.setAttribute('aria-selected', selected ? 'true' : 'false');
			tab.classList.toggle('selected', selected);
			const tabPanel = /** @type {HTMLElement} */ (
				document.getElementById(/** @type {string} */ (tab.getAttribute('aria-controls')))
			);
			tabPanel.classList.toggle('opened', selected);
		}
	},

	/** @param {KeyboardEvent} event */
	handleTabKeydown: function (event) {
		const target = /** @type {HTMLInputElement} */ (event.currentTarget);
		if (!['Home', 'End'].includes(event.key)) return;
		event.preventDefault();

		const radios = /** @type {HTMLInputElement[]} */ (
			Array.from(document.querySelectorAll(`input[name="${target.name}"]`))
		);
		const radio = event.key === 'Home' ? radios[0] : radios[radios.length - 1];
		radio.checked = true;
		radio.dispatchEvent(new Event('change', { bubbles: true }));
	},

	/** @param {Event} event */
	handleCopy: function (event) {
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
		const copyFn = userOptions?.copy ?? defaultCopy;
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
			}, userOptions?.copyTimeoutMs ?? 3000),
		});
	},

	/** @param {Event} event */
	handleFullscreenChange: function (event) {
		const target = /** @type {HTMLButtonElement} */ (event.currentTarget);

		const btn = /** @type {HTMLButtonElement} */ (target.querySelector('.codeblock-fullscreen'));

		const openLabel = btn.dataset.openLabel ?? 'Open fullscreen';
		const exitLabel = btn.dataset.exitLabel ?? 'Exit fullscreen';

		const icon = /** @type {HTMLElement} */ (btn.firstElementChild);
		const openClases = (icon.dataset.openClass ?? '').split(' ').filter(Boolean);
		const exitClasses = (icon.dataset.exitClass ?? '')
			.split(' ')
			.filter(Boolean)
			.filter((cls) => !openClases.includes(cls));

		const collapseSwitch = /** @type {HTMLInputElement | null} */ (
			target.querySelector('.codeblock-collapse input')
		);

		if (document.fullscreenElement?.isSameNode(target)) {
			btn.setAttribute('aria-label', exitLabel);
			for (const cls of exitClasses) {
				icon.classList.toggle(cls, true);
			}
			if (collapseSwitch?.checked) {
				collapseSwitch.checked = false;
				collapseSwitch.dispatchEvent(new Event('change', { bubbles: true }));
			}
			collapseSwitch?.toggleAttribute('disabled', true);
		} else {
			btn.setAttribute('aria-label', openLabel);
			for (const cls of exitClasses) {
				icon.classList.toggle(cls, false);
			}
			collapseSwitch?.toggleAttribute('disabled', false);
			target.removeEventListener('fullscreenchange', listeners.handleFullscreenChange);
		}
	},
	/** @param {Event} event */
	handleFullscreen: async function (event) {
		const target = /** @type {HTMLButtonElement} */ (event.currentTarget);
		const root = /** @type {HTMLElement} */ (target.closest('.codeblock-root'));
		if (document.fullscreenElement?.isSameNode(root)) {
			document.exitFullscreen();
		} else {
			root.addEventListener('fullscreenchange', listeners.handleFullscreenChange);
			await root.requestFullscreen();
		}
	},
};

/** @type {EnhanceCodeBlockCopy} */
const defaultCopy = function ({ pre }) {
	return pre.textContent;
};

/**
 * @typedef EnhanceCodeBlockCopyContext
 * @property {HTMLPreElement} pre `pre` element of the associated code block, in group this is the currently selected one
 * @property {HTMLButtonElement} btn `button` element that was clicked to trigger the copy action
 */

/**
 * @callback EnhanceCodeBlockCopy
 * @param {EnhanceCodeBlockCopyContext} context relevant information for determining what text to copy
 * @returns {string | null | undefined | false | void} a string to pass to `navigator.clipboard.writeText()`,
 * or any falsy value if implementing custom copy logic (e.g. use the legacy `execCommand('copy')` method)
 */

/**
 * @typedef EnhanceCodeBlockOptions
 * @property {EnhanceCodeBlockCopy} [copy]  instruction on what text to copy
 * @property {number} [copyTimeoutMs] how long to show the "copied" state before reverting back to the default state, in milliseconds
 */

/**
 * attach event listeners to code blocks for progressively-enhanced functionalities
 * @param {EnhanceCodeBlockOptions} [options]
 * @returns {void}
 */
export function enhanceCodeblock(options) {
	userOptions = options;

	// 1. Update for tab changes in grouped code blocks
	for (const tab of select.tabs()) {
		const radio = /** @type {HTMLInputElement} */ (tab.querySelector('input[type="radio"]'));
		radio.addEventListener('change', listeners.handleTabChange);
		radio.addEventListener('keydown', listeners.handleTabKeydown);
		tab.setAttribute(
			'aria-selected',
			/** @type {HTMLInputElement} */ (radio).checked ? 'true' : 'false',
		);
		if (radio.checked) {
			/** @type {HTMLElement} */ (
				document.getElementById(/** @type {string} */ (tab.getAttribute('aria-controls')))
			).classList.add('opened');
		}
	}

	// 2. Enable copy functionality
	for (const btn of select.copyBtns()) {
		btn.addEventListener('click', listeners.handleCopy);
	}

	// 3. Enable fullscreen functionality
	for (const btn of select.fullscreenBtns()) {
		btn.addEventListener('click', listeners.handleFullscreen);
	}

	// 4. Mark code blocks as enhanced so that JS-dependent elements are visible
	for (const block of select.codeblocks()) {
		const root = /** @type {HTMLElement | null}  */ (block.closest('.codeblock-root'));
		root?.classList.add('enhanced');
	}
}
