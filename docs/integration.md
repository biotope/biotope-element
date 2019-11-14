---
id: integration
title: IDE Integration
---

Currently there are no dev tools or extensions for browsers and IDEs that are supported by us.

However, we can show you how we work efficiently with `biotope-element` on these editors.

## VSCode

Use `@biotope/quality-gate` for code checking. You can find out more about how to easily set it up
on VSCode in [our repo](https://github.com/biotope/biotope-quality-gate). This will cover most of
your use-cases and prevent you from writing no-so-good code.

Install the `lit-html` extension to get color-coded HTML when writing your component's HTML and any
partials you need. You can also add the following code to your `settings.json` so that you can take
advantage of the amazing HTML helpers available in VSCode (like `dev.class`).

```json
// Add HTML helpers on non-html files
"emmet.includeLanguages": {
    "typescript": "html",
    "javascript": "html"
},
```
