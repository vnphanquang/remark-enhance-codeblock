import { expect, test, vi } from 'vitest';

import { create_id } from '../../src/internals/create-id';

test('should generate UUID if module is available', () => {
	expect(create_id()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
});

test('should fallback to Math.random if crypto is not available', () => {
	vi.stubGlobal('crypto', undefined);
	expect(create_id()).toHaveLength(8);
	vi.unstubAllGlobals();
});

test('should fallback to Math.random if randomUUID is not available in crypto', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	vi.spyOn(crypto, 'randomUUID' as any, 'get').mockReturnValue(undefined);
	expect(create_id()).toHaveLength(8);
	vi.restoreAllMocks();
});
