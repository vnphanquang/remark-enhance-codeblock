/** @returns {string} */
export function create_id() {
	if (globalThis['crypto'] && globalThis['crypto']['randomUUID']) {
		return crypto.randomUUID();
	}
	return Math.random().toString(36).slice(2, 10);
}
