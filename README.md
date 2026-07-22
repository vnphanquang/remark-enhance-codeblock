# remark-enhance-codeblock

a remark plugin to enhance markdown code block or group of code blocks

[![MIT][license.badge]][license] [![npm.badge]][npm] [![codecov][codecov.badge]][codecov]

## Installation

Install with a package manager:

```bash
pnpm add -D remark-enhance-codeblock # or via npm, yarn, ...
```

In browser from [esm.sh]:

```javascript
import remarkEnhanceCodeblock from 'https://esm.sh/remark-enhance-codeblock';
```

## Usage

> [!IMPORTANT]
> This package assumes [remark-rehype](https://github.com/remarkjs/remark-rehype) follows somewhere in the `unified` pipeline.

The central idea is to turn a markdown such as:

````markdown
> [!CODEGROUP]
>
> ```html #title="index.html"
> <!doctype html>
> <html>
> 	<head>
> 		<link rel="stylesheet" href="./style.css" />
> 		<script module src="./script.js"></script>
> 	</head>
> 	<body>
> 		<main>Hello world!</main>
> 	</body>
> </html>
> ```
>
> ```css #title="style.css"
> main {
> 	color: green;
> }
> ```
>
> ```js #title="script.js"
> console.log('Hello world!');
> ```
````

...to the following UI:

![demo UI](https://github.com/vnphanquang/remark-enhance-codeblock/blob/main/.github/assets/demo-ui.gif)

To achieve this, follow these steps:

1. Add `remark-enhance-codeblock` to the `unified` pipeline:

   ```javascript
   import remarkEnhanceCodeblock from 'remark-enhance-codeblock';
   import rehypeStringify from 'rehype-stringify';
   import remarkParse from 'remark-parse';
   import remarkRehype from 'remark-rehype';
   import { unified } from 'unified';

   const file = await unified()
   	.use(remarkParse)
   	.use(remarkEnhanceCodeblock)
   	.use(remarkRehype)
   	.use(rehypeStringify)
   	.process(input);

   console.log(String(file));
   ```

   Customisation is described in the [Plugin Options](#plugin-options) section.

2. Add the necessary CSS where applicable:

   ```css
   @import 'remark-enhance-codeblock/styles/app.css';
   /* or via CDN: */
   @import 'https://esm.sh/remark-enhance-codeblock/styles/all.css';
   ```

   Several different CSS strategies are listed in the [CSS Strategies](#css-strategies) section.

3. Add progressive enhancement with JS when and where possible:

   ```javascript
   import { enhanceCodeblock } from 'remark-enhance-codeblock/client';
   /* or via CDN: */
   import { enhanceCodeblock } from 'https://esm.sh/remark-enhance-codeblock/client';

   // call where appropriate
   enhanceCodeblock();
   ```

   Options to `enhanceCodeblock` are listed in the [Client Options](#client-options) section.

## Syntax

### Individual Code Block

````markdown
```lang #title="Some heading or filename.ext" #trim="both" #file-icon
console.log('Hello world!');
```
````

#### Enhancement Attributes

Enhancement attributes are processed by the plugin and marked with a `#` prefix to distinguish
from regular HTML attributes. All attributes listed below are optional.

| Attribute    | Type    | Inherits                                                                           | Supported Values                       | Description                               |
| ------------ | ------- | ---------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------- |
| `#title`     | string  | none                                                                               |                                        | title to display in the header            |
| `#trim`      | string  | from [Plugin Options](#plugin-options)                                             | `'both'`, `'start'`, `'end'`, `'none'` | trim strategy for the code content        |
| `#file-icon` | boolean | from [Group](#group-of-code-blocks), if any, and [Plugin Options](#plugin-options) | `true`, `false`, blank means `true`    | whether to show file icon preceding title |

#### Passing Additional HTML Attributes

Regular HTML attributes may be added to the meta string of the code element and will be passed on to
the final HTML. Specifying an attribute will replace any existing one by default.
Alternatively, one may add a `^` prefix to **prepend**, or `$` to **append** to existing attributes.

For example, to **append** some custom classes, one can do:

````markdown
```js #title="script.js" $class="custom-codeblock"
console.log('Hello world!');
```
````

> [!IMPORTANT]
> HTML attributes will be passed onto the `.codeblock` element, that is, the direct parent of `<pre>`.

### Group of Code Blocks

A group of code blocks is wrapped in a blockquote with a `> [!CODEGROUP]` marker.

````markdown
> [!CODEGROUP]
>
> ```lang
> first tab
> ```
>
> ```lang
> second tab
> ```
>
> any non-code element will be stripped
````

One typical pattern is shown in [Usage](#usage) section, where several different code blocks are
grouped as related files.

#### Attributes

Much like in individual code blocks, additional attributes may be specified on the group node.
The meta string here, however, must be wrapped in backticks and follow directly after the marker.

```markdown
> [!CODEGROUP] `$class="custom-codeblock-group" data-boolean`
> ...
```

> [!IMPORTANT]
> HTML Attributes will be passed onto the `.codeblock-group` element.

The only supported enhancement attribute for group at this time is `#file-icon`.
For example a group of code blocks may not necessarily represent files, but different options,
in which case showing file icons may not be appropriate:

````markdown
> [!CODEGROUP] `#file-icon=false`
>
> ```bash #title="npm"
> npm install --save-dev remark-enhance-codeblock
> ```
>
> ```bash #title="pnpm"
> pnpm add -D remark-enhance-codeblock
> ```
>
> ```bash #title="yarn"
> yarn add -D remark-enhance-codeblock
> ```
````

![demo no file icon](https://github.com/vnphanquang/remark-enhance-codeblock/blob/main/.github/assets/demo-ui-no-file-icon.gif)

## Plugin Options

### Trim Strategy

The global trim strategy for code content:

```typescript
type RemarkEnhanceCodeblockTrimStrategy = 'start' | 'end' | 'both' | 'none';

// default:
remarkEnhanceCodeblock({ trim: 'both' });
```

`#trim` attribute on individual code blocks will take precedence over the global trim strategy.

### Texts and Internationalisation

Text labels for buttons and switches in `remark-enhance-codeblock`.
Even though the typing is permissive (every field is optional), it is recommended,
when supporting a different language, to provide all labels for a consistent user experience.

```typescript
export interface RemarkEnhanceCodeblockIntl {
	copy?: {
		/** aria-label for the copy button */
		default?: string;
		/** aria-label for the copy button after code has been copied */
		copied?: string;
	};
	fullscreen?: {
		/** aria-label for the button that requests fullscreen */
		open?: string;
		/** aria-label for the button that exits fullscreen */
		exit?: string;
	};
	/** aria-label for the collapse switch */
	collapse?: string;
}

// default:
remarkEnhanceCodeblock({
	intl: {
		copy: {
			default: 'Copy',
			copied: 'Copied',
		},
		fullscreen: {
			open: 'Open fullscreen',
			exit: 'Exit fullscreen',
		},
		collapse: 'Collapse',
	},
});
```

### Icon Classes

By default, icons are rendered using [mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image) with URL-encoded SVG in CSS. Icon sources are from the [Phosphor Icons](https://phosphoricons.com/) set.

Icon classes may be customised, for example, to use different icon sources or tap into some existing
design system / CSS framework such as Tailwind (e.g. using [phosphor-icons-tailwindcss](https://github.com/vnphanquang/phosphor-icons-tailwindcss)).

```typescript
export interface RemarkEnhanceCodeblockIconClasses {
	/** icon class names for the copy button */
	copy?: {
		default?: string;
		copied?: string;
	};
	/** icon class names for the fullscreen button */
	fullscreen?: {
		open?: string;
		exit?: string;
	};
	/** icon class names for the collapse switch */
	collapse?: string;
	/** icon class names for language file icon before the title if provided */
	file?: (lang?: string | null | undefined) => string;
}

// default:
remarkEnhanceCodeblock({
	iconClasses: {
		copy: {
			default: 'i i-clipboard',
			copied: 'i i-clipboard-text',
		},
		fullscreen: {
			open: 'i i-corners-out',
			exit: 'i i-corners-in',
		},
		collapse: 'i i-caret-up',
		file: (lang) => `i i-file${lang ? ` i-file-${lang}` : ''}`;
	},
});
```

When customising icon classes, consider switching to the appropriate CSS strategy, as mentioned
in the [CSS Strategies](#css-strategies) section, for a smaller bundle size.

### Group Blockquote Marker

The marker for group, i.e `> [!<marker>]` may be customised, even though this is typically not
necessary, unless for some further remark transformation.

```typescript
type RemarkEnhanceCodeblockGroupMarker = `!${string}`;

// default:
remarkEnhanceCodeblock({ groupBlockquoteMarker: '!CODEGROUP' });
```

> [!NOTE]
> Blockquote transformation are made possible using [remark-transform-blockquote](https://github.com/vnphanquang/remark-transform-blockquote).

### MDAST Custom Node Type

When transforming the [code](https://github.com/syntax-tree/mdast#code) element, some non-standard nodes
are added to the syntax tree, marked for HTML output with `rehype` by `data.hProperties` and `data.hName`.
If additional transformation is necessary, the node type may be customised:

```typescript
type RemarkEnhanceCodeblockNodeType = string;

// default
remarkEnhanceCodeblock({ nodeType: 'enhance-codeblock' });
```

## CSS Strategies

The stylesheet mentioned in [Usage](#usage) section, `.../styles/app.css`, is the maximal bundle that
includes all features:

```css
/* CSS for individual codeblock */
@import url('./bare/base.css') layer(enhance-code-block.base);

/* CSS for group of codeblocks */
@import url('./bare/group.css') layer(enhance-code-block.group);

/* CSS for SVG-in-CSS icon rendering strategy, and sources for icons used in actions */
@import url('./bare/icons.css') layer(enhance-code-block.icons);

/* sources for common file icons */
@import url('./bare/file-icons.css') layer(enhance-code-block.icons);
```

If file icons are turned off or provided via some custom solution, use the `no-file-icons` entry,
which drops `./bare/file-icons.css`:

```css
@import 'remark-enhance-codeblock/styles/no-file-icons.css';
/* or via CDN: */
@import 'https://esm.sh/remark-enhance-codeblock/styles/no-file-icons.css';
```

If icons in actions are also provided via some custom solution, use the `no-icons` entry, which drops both
`./bare/icons.css` and `./bare/file-icons.css`:

```css
@import 'remark-enhance-codeblock/styles/no-icons.css';
/* or via CDN: */
@import 'https://esm.sh/remark-enhance-codeblock/styles/no-icons.css';
```

If the [Group](#group-of-code-blocks) feature is not used, `./bare/group.css` can also be dropped
for the most minimal bundle:

```css
@import url('remark-enhance-codeblock/styles/bare/base.css') layer(enhance-code-block.base);
/* or via CDN: */
@import 'https://esm.sh/remark-enhance-codeblock/styles/bare/base.css'
	layer(enhance-code-block.base);
```

### CSS Layers

Notice that the default entries imports "bare" CSS files into different [CSS layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer).
This is my preferred approach; but they can also be imported directly to the default layer:

```css
@import url('remark-enhance-codeblock/styles/bare/base.css');
```

### CSS Variables

The stylesheets rely heavily on [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties) to allow customisation.
They are named in a `--c-*` pattern and each has a default counterparts `--cd-*`. For example:

```css
.codeblock-content {
	max-height: var(--c-max-height, var(--cd-content-max-height));
}
```

Specify any of the following variables where appropriate, typically on `:root` or where the design system lives. For example:

```css
:root {
	--c-max-height: 25rem;
}
```

| CSS Variable                        | Default Counterpart                  | Default Value                                             |
| ----------------------------------- | ------------------------------------ | --------------------------------------------------------- |
| `--c-font-size`                     | `--cd-font-size`                     | `1rem`                                                    |
| `--c-font-size-fullscreen`          | `--cd-font-size-fullscreen`          | `calc(var(--c-font-size, var(--cd-font-size)) * 1.25)`    |
| `--c-font-family`                   | `--cd-font-family`                   | `monospace`                                               |
| `--c-margin-block`                  | `--cd-margin-block`                  | `1.5em`                                                   |
| `--c-padding-block`                 | `--cd-padding-block`                 | `0.75em`                                                  |
| `--c-padding-inline`                | `--cd-padding-inline`                | `1em`                                                     |
| `--c-border-width`                  | `--cd-border-width`                  | `1.5px`                                                   |
| `--c-border-style`                  | `--cd-border-style`                  | `solid`                                                   |
| `--c-border-color`                  | `--cd-border-color`                  | `light-dark(black, white)`                                |
| `--c-border-radius`                 | `--cd-border-radius`                 | `0`                                                       |
| `--c-focus-outline-color`           | `--cd-focus-outline-color`           | `blue`                                                    |
| `--c-focus-outline-width`           | `--cd-focus-outline-width`           | `calc(var(--c-border-width, var(--cd-border-width)) * 2)` |
| `--c-header-bg`                     | `--cd-header-bg`                     | `light-dark(#f7f7f7, #151515)`                            |
| `--c-content-max-height`            | `--cd-content-max-height`            | `30dvh`                                                   |
| `--c-content-bg`                    | `--cd-content-bg`                    | `light-dark(white, black)`                                |
| `--c-transition-duration`           | `--cd-transition-duration`           | `120ms`                                                   |
| `--c-action-padding`                | `--cd-action-padding`                | `0.5em`                                                   |
| `--c-hover-bg`                      | `--cd-hover-bg`                      | `light-dark(black, white)`                                |
| `--c-hover-color`                   | `--cd-hover-color`                   | `light-dark(white, black)`                                |
| `--c-tab-selected-color`            | `--cd-tab-selected-color`            | `var(--cd-border-color)`                                  |
| `--c-file-icon-offset-inline-start` | `--cd-file-icon-offset-inline-start` | `0em`, `0.26em` when using the default file-icon strategy |

Default counterparts are defined on `.codeblock` for standalone code blocks, or on
`.codeblock-group` for grouped code blocks.

## Client Options

Progressive enhancement options and their defaults:

```typescript
interface EnhanceCodeBlockOptions {
	/** instruction on what text to copy */
	copy: EnhanceCodeBlockCopy;
	/** how long to show the "copied" state before reverting back to the default state, in milliseconds */
	copyTimeoutMs:
}

/**
 * @param context
 * @returns a string to pass to `navigator.clipboard.writeText()`,
 *          or any falsy value if implementing custom copy logic
 *          (e.g. use the legacy `execCommand('copy')` method)
 */
type EnhanceCodeBlockCopy = (
	context: EnhanceCodeBlockCopyContext,
) => string | null | undefined | false | void;

interface EnhanceCodeBlockCopyContext {
	/** `pre` element of the associated code block, in group this is the currently selected one */
	pre: HTMLPreElement;
	/** `button` element that was clicked to trigger the copy action */
	btn: HTMLButtonElement;
}

// default
enhanceCodeblock({
	copy: ({ pre }) => pre.textContent,
	copyTimeoutMs: 3000,
});
```

## Problem Space and Focus

This library is a compact and somewhat opinionated version of what I have used in several projects
where sharing code vs blog posts or documentation was necessary. Existing solutions that I had found
either relied too much on runtime Javascript, or were framework-specific.

My focus here includes:

- accessibility (to the best of my knowledge),
- progressive enhancement: works without JS, enhanced when JS is available,
- a convenient code-sharing experience when authoring technical content on the web,
- utilisation of contemporary baseline platform features
  (e.g. CSS [anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning) and
  [@starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style)),
- sensible defaults with customisation capabilities.

## Not a Syntax Highlighter

Syntax highlighting is not included in this library. I recommend [shiki](https://shiki.style/) for
that purpose.

## Features

- Optional header with title and file icon.
- Can be collapsed in a accordion-like fashion.
- Grouped multiple code blocks into a single tabbed interface.

Features that require JS:

- Copy-to-clipboard
- Fullscreen view

## CONTRIBUTING

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## More `unified` Plugins by Me

- [remark-transform-blockquote](https://github.com/vnphanquang/remark-transform-blockquote)
- [remark-codeblock-source](https://github.com/vnphanquang/remark-codeblock-source)

---

[built by human, not agents](https://gist.github.com/vnphanquang/018ee2b2080c9dc9890327f3d233998b).

[esm.sh]: https://esm.sh/
[importmap]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap

<!-- header badges -->

[license.badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: ./LICENSE
[npm.badge]: https://img.shields.io/npm/v/remark-enhance-codeblock
[npm]: https://www.npmjs.com/package/remark-enhance-codeblock
[codecov]: https://codecov.io/github/vnphanquang/remark-enhance-codeblock
[codecov.badge]: https://codecov.io/github/vnphanquang/remark-enhance-codeblock/graph/badge.svg
