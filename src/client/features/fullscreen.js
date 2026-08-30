/** @param {Event} event */
function handleFullscreenChange(event) {
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
		target.removeEventListener('fullscreenchange', handleFullscreenChange);
	}
}

/** @param {Event} event */
async function handleFullscreen(event) {
	const target = /** @type {HTMLButtonElement} */ (event.currentTarget);
	const root = /** @type {HTMLElement} */ (target.closest('.codeblock-root'));
	if (document.fullscreenElement?.isSameNode(root)) {
		document.exitFullscreen();
	} else {
		root.addEventListener('fullscreenchange', handleFullscreenChange);
		await root.requestFullscreen();
	}
}

/** */
export function enhanceFullscreen() {
	const btns = /** @type {NodeListOf<HTMLButtonElement>} */ (
		document.querySelectorAll('.codeblock-fullscreen')
	);
	for (const btn of btns) {
		btn.addEventListener('click', handleFullscreen);
	}
}
