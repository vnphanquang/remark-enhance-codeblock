function selectTabs() {
	return /** @type {NodeListOf<HTMLLabelElement>} */ (document.querySelectorAll('.codeblock-tab'));
}

/** @param {Event} event */
function handleTabChange(event) {
	const target = /** @type {HTMLInputElement} */ (event.currentTarget);
	const tabTarget = /** @type {HTMLLabelElement} */ (target.parentElement);

	// per HTML specs `change` event only fires for the radio that was selected in a group, so no
	// need to check for `target.checked` here

	const tabs = selectTabs();
	for (const tab of tabs) {
		const selected = tab.isSameNode(tabTarget);
		tab.setAttribute('aria-selected', selected ? 'true' : 'false');
		tab.classList.toggle('selected', selected);
		const tabPanel = /** @type {HTMLElement} */ (
			document.getElementById(/** @type {string} */ (tab.getAttribute('aria-controls')))
		);
		tabPanel.classList.toggle('opened', selected);
	}
}

/** @param {KeyboardEvent} event */
function handleTabKeydown(event) {
	const target = /** @type {HTMLInputElement} */ (event.currentTarget);
	if (!['Home', 'End'].includes(event.key)) return;
	event.preventDefault();

	const radios = /** @type {HTMLInputElement[]} */ (
		Array.from(document.querySelectorAll(`input[name="${target.name}"]`))
	);
	const radio = event.key === 'Home' ? radios[0] : radios[radios.length - 1];
	radio.checked = true;
	radio.dispatchEvent(new Event('change', { bubbles: true }));
}

/** */
export function enhanceTabs() {
	for (const tab of selectTabs()) {
		const radio = /** @type {HTMLInputElement} */ (tab.querySelector('input[type="radio"]'));
		radio.addEventListener('change', handleTabChange);
		radio.addEventListener('keydown', handleTabKeydown);
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
}
