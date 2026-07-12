// Copyright (c) Quang Phan. All rights reserved. Licensed under the MIT license.

export * from './plugin.js';
export * from './types.public.js';

import { remarkEnhanceCodeblock } from './plugin.js';
export { DEFAULT_OPTIONS as defaultOptions } from './internals/resolve-options.js';
export default remarkEnhanceCodeblock;
