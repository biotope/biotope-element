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

We advise this package to be installed as a dev dependency or ran using `npx`. You can install it
with `npm install biotope` and you can read more about it in our [GitHub repo](https://github.com/biotope/biotope).

## @biotope/resource-loader
`@biotope/resource-loader` makes it easy for you to load the components you built with `biotope-element`
like so:

```html
<my-button data-resources="[{paths: ['path/to/js/my-button.js']}]"></my-button>
```

This will load the script and attach it to the DOM.

You can install it with `npm install @biotope/resource-loader` and you can read more about it in our
[GitHub repo](https://github.com/biotope/biotope-resource-loader).

## @biotope/quality-gate
`@biotope/quality-gate` makes it easy for you to lint the components you built with `biotope-element`
by running a simple command:

```bash
> biotope-quality-gate
```

We advise this package to be installed as a dev dependency. You can install it with `npm install @biotope/quality-gate -D`
and you can read more about it in our [GitHub repo](https://github.com/biotope/biotope-quality-gate).
