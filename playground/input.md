## Standalone Code Block

### Single line, no title

```javasrcipt
console.log('Hello World');
```

### Single line with title

```javasrcipt #title="script.js"
console.log('Hello World');
```

### Multiple lines, no title

```html #src="fs:../tests/fixtures/group-files/index.html"

```

### Multiple lines with title

```html #src="fs:../tests/fixtures/group-files/index.html" #title="index.html"

```

## Group of Code Blocks

List of files:

> [!CODEGROUP]
>
> ```html #src="fs:../tests/fixtures/group-files/index.html" #title="index.html"
>
> ```
>
> ```css #src="fs:../tests/fixtures/group-files/style.css" #title="style.css"
>
> ```
>
> ```js #src="fs:../tests/fixtures/group-files/script.js" #title="script.js"
>
> ```

List of options / tabs, no file icons

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

## File Icons

> [!CODEGROUP]
>
> ```javascript #title="javascript"
> console.log('Hello World');
> ```
>
> ```js #title="js"
> console.log('Hello World');
> ```
>
> ```jsx #title="jsx"
> console.log('Hello World');
> ```

> [!CODEGROUP]
>
> ```typescript #title="typescript"
> console.log('Hello World');
> ```
>
> ```ts #title="ts"
> console.log('Hello World');
> ```
>
> ```tsx #title="tsx"
> console.log('Hello World');
> ```

> [!CODEGROUP]
>
> ```markdown #title="markdown"
> # Hello World
>
> This is a markdown file
> ```
>
> ```md #title="md"
> # Hello World
>
> This is a markdown file
> ```
>
> ```mdx #title="mdx"
> # Hello World
>
> This is a markdown file
> ```

```vue #title="vue"
<script setup>
import { ref } from 'vue';
const message = ref('Hello World!');
</script>

<template>
	<h1>{{ message }}</h1>
</template>
```

```svg #title="svg"
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
	<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
```

```csv #title="csv"
Language,Abbreviation,Year
Hypertext Markup Language,HTML,1993
Cascading Style Sheets,CSS,1996
JavaScript,JS,1995
TypeScript,TS,2012
```

> [!CODEGROUP]
>
> ```rust #title="rust"
> fn main() {
>   	println!("Hello, world!");
> }
> ```
>
> ```rs #title="rs"
> fn main() {
>   	println!("Hello, world!");
> }
> ```

> [!CODEGROUP]
>
> ```python #title="python"
> def main():
>   	print("Hello, world!")
> ```
>
> ```py #title="py"
> def main():
>   	print("Hello, world!")
> ```

```sql #title="sql"
SELECT * FROM languages WHERE release_year > 1993;
```

```txt #title="txt"
This is a plain text file.
```

> [!CODEGROUP]
>
> ```terminal #title="terminal"
> echo "Hello, world!"
> ```
>
> ```shell #title="shell"
> echo "Hello, world!"
> ```
>
> ```bash #title="bash"
> echo "Hello, world!"
> ```
>
> ```sh #title="sh"
> echo "Hello, world!"
> ```
>
> ```fish #title="fish"
> echo "Hello, world!"
> ```

> [!CODEGROUP]
>
> ```c++ #title="c++" src="fs:../tests/fixtures/per-syntax/code.cpp"
> ```
>
> ```cpp #title="cpp" src="fs:../tests/fixtures/per-syntax/code.cpp"
> ```

> [!CODEGROUP]
>
> ```c# #title="c++" src="fs:../tests/fixtures/per-syntax/code.cs"
> ```
>
> ```cs #title="cs" src="fs:../tests/fixtures/per-syntax/code.cs"
> ```

```ini #title="ini" src="fs:../tests/fixtures/per-syntax/code.ini"
```

```c #title="c" src="fs:../tests/fixtures/per-syntax/code.c"
```

## Trim

> [!CODEGROUP]
>
> ```javascript #title="none" #trim=none
>
> // this file has some leading...
> console.log('Hello world!');
> // ...and trailing whitespace
>
> ```
>
> ```javascript #title="both (default)"
>
> // this file has some leading...
> console.log('Hello world!');
> // ...and trailing whitespace
>
> ```
>
> ```javascript #title="start" #trim=start
>
> // this file has some leading...
> console.log('Hello world!');
> // ...and trailing whitespace
>
> ```
>
> ```javascript #title="end" #trim=end
>
> // this file has some leading...
> console.log('Hello world!');
> // ...and trailing whitespace
>
> ```
>
