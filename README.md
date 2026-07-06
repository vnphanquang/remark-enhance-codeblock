# remark-enhance-codeblock

enhance markdown codeblock. WIP not published yet.

[![MIT][license.badge]][license] [![npm.badge]][npm] [![codecov][codecov.badge]][codecov]

## Installation

```bash
pnpm add -D remark-enhance-codeblock # or via npm, yarn, ...
```

## Usage

## Group

### Files

````markdown
> [!CODE] `!group=files`
>
> ```html title="index.html"
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
> ```css title="style.css"
> main {
> 	color: green;
> }
> ```
>
> ```js title="script.js"
> console.log('Hello world!');
> ```
````

### Tabs

````markdown
> [!CODE] `!group=tabs`
>
> ```bash title="npm"
> npm install --save-dev remark-enhance-codeblock
> ```
>
> ```bash title="pnpm"
> pnpm add -D remark-enhance-codeblock
> ```
>
> ```bash title="yarn"
> yarn add -D remark-enhance-codeblock
> ```
````

## CONTRIBUTING

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## More `unified` Plugins by Me

- [remark-transform-blockquote](https://github.com/vnphanquang/remark-transform-blockquote)
- [remark-codeblock-source](https://github.com/vnphanquang/remark-codeblock-source)

---

[built by human, not agents](https://gist.github.com/vnphanquang/018ee2b2080c9dc9890327f3d233998b).

<!-- header badges -->

[license.badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: ./LICENSE
[npm.badge]: https://img.shields.io/npm/v/remark-enhance-codeblock
[npm]: https://www.npmjs.com/package/remark-enhance-codeblock
[codecov]: https://codecov.io/github/vnphanquang/remark-enhance-codeblock
[codecov.badge]: https://codecov.io/github/vnphanquang/remark-enhance-codeblock/graph/badge.svg?token=dKkYUy4evr
