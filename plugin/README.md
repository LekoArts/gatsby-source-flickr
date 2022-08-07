# @lekoarts/gatsby-plugin-starter

<<<PLUGIN_DESCRIPTION>>>

## Install

```shell
npm install @lekoarts/gatsby-plugin-starter
```

## How to use

Add the plugin to your `gatsby-config` file:

```js:title=gatsby-config.js
module.exports = {
	plugins: [
		{
			resolve: `@lekoarts/gatsby-plugin-starter`,
			options: {}
		}
	]
}
```

## Plugin Options

- [optionA (**required**)](#optiona-required)
- [optionB](#optionb)

### optionA (**required**)

Example description for optionA.

**Field type**: `String`

```js
{
	resolve: `plugin`,
	options: {
    optionA: "Hello World",
  },
}
```

### optionB

Example description for optionB.

**Field type**: `String`

**Default value**: `Hello World`

```js
{
	resolve: `plugin`,
	options: {
    optionB: "Hello World Again",
  },
}
```
