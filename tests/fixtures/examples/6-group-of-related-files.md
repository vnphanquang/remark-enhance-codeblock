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
> 	background-color: white;
>
> 	&::after {
> 		content: 'Hello world';
> 		color: black;
> 	}
> }
> ```
>
> ```js #title="script.js"
> /**
>  * @param {string}
>  * @returns {void}
>  */
> export function main(name) {
> 	console.log(`Hello ${name}!`);
> }
> ```
