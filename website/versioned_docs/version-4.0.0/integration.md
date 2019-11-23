---
id: version-4.0.0-integration
title: IDE Integration
original_id: integration
---

Currently there are no dev tools or extensions for browsers and IDEs that are officially supported
by us.

However, we can show you how we work efficiently with `biotope-element` on the following editors.

## VSCode

Use `@biotope/quality-gate` for code checking. You can find out more about how to easily set it up
on VSCode in [our repo](https://github.com/biotope/biotope-quality-gate). This will cover most of
your use-cases and prevent you from writing not-so-good code.

Install the `lit-html` extension to get color-coded HTML when writing your component's HTML and any
partials you need. You can also add the following code to your `settings.json` so that you can take
advantage of the amazing HTML helpers available in VSCode (through `emmet`).

```json
// Add HTML helpers on non-html files
"emmet.includeLanguages": {
    "typescript": "html",
    "javascript": "html"
},
```
