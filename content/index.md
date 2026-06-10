---
title: Home
order: 1
nav: true
---

# Markdown to Website

A minimal static site generator for converting Markdown files into clean, professional HTML.

## Features

- **Simple Markdown** - Write content in clean, easy-to-read Markdown
- **YAML Frontmatter** - Control page metadata with simple YAML headers
- **Monospace Design** - Modern, minimal aesthetic inspired by professional developer sites
- **Automatic Navigation** - Navigation menus build themselves from your content
- **Development Server** - Watch files and rebuild automatically at `localhost:8765`
- **Static Output** - Generate clean HTML ready for any web server

## Quick Start

Write markdown files in the `content/` directory with frontmatter:

```markdown
---
title: My Page
order: 1
nav: true
---

# Your content here

Just write in Markdown.
```

Run `python3 build.py serve` to start the development server, or `python3 build.py build` to generate static HTML.

> Here's a blockquote to test
