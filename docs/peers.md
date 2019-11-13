---
id: peers
title: Peer Packages
---

Here you can find packages that are helpful when using `biotope-element`.

## biotope
`biotope` is our CLI tool to create projects with Biotope. This also includes generating `biotope-element`
components with:

```bash
biotope generate
```

You can install it with `npm install biotope` and can read more about it in our [github repo](https://github.com/biotope/biotope).

## @biotope/resource-loader
`@biotope/resource-loader` makes it easy for you to load the components you built with `biotope-element`
like so:

```html
<my-button data-resources="[{paths: ['path/to/js/my-button.js']}]"></my-button>
```

This will load the script and attach it to the dom.

You can install it with `npm install @biotope/resource-loader` and you can read more about it in our
[github repo](https://github.com/biotope/biotope-resource-loader).
