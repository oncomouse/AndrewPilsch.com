# Markdown to Website Converter

A simple Python-based static site generator that converts Markdown files into a professional HTML website with templating and automatic navigation.

## Features

- **Markdown to HTML**: Convert Markdown files with syntax highlighting and extended features
- **YAML Frontmatter**: Add metadata to your pages (title, navigation order, visibility)
- **Jinja2 Templating**: Customize site design with powerful, flexible templates
- **Auto-Generated Navigation**: Navigation menu builds automatically from your content
- **Development Server**: Watch for file changes and rebuild automatically on port 8765
- **Debug Mode**: Add build timestamps and source file info during development
- **Clean URLs**: Filenames automatically converted to lowercase with dashes

## Quick Start

### Installation

1. **Create and activate a virtual environment** (recommended):

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:

```bash
pip install -r requirements.txt
```

### Build the Site

```bash
python build.py build
```

This generates static HTML files in the `output/` directory.

### Development Server

```bash
python build.py serve
```

Starts a dev server on `http://localhost:8765` with:
- File watching for automatic rebuilds
- Debug information injected into HTML
- Auto-reload on file changes

Add `--debug` flag to any command to include debug info:

```bash
python build.py build --debug
```

## Project Structure

```
new-webpage/
├── content/              # Your Markdown files
│   ├── index.md
│   ├── about.md
│   └── ...
├── templates/            # HTML templates
│   ├── base.html        # Main layout
│   └── page.html        # Page template
├── output/              # Generated HTML (git-ignored)
├── build.py             # Main build script
└── requirements.txt     # Python dependencies
```

## Frontmatter Options

Add YAML metadata at the top of your Markdown files:

```markdown
---
title: My Page Title
order: 1
nav: true
css: custom.css
---

# Page Content

Your markdown content here...
```

- **title**: Page title (appears in browser tab and as H1)
- **order**: Numeric value for navigation ordering (lower = first)
- **nav**: `true`/`false` - include in navigation menu
- **css**: Optional path to custom CSS file relative to `content/` directory

## Creating Pages

1. Create a new `.md` file in the `content/` directory
2. Add frontmatter with page metadata
3. Write your content in Markdown
4. The site automatically rebuilds

### Filename Conventions

- Filenames are converted to lowercase with dashes
- `My-Page.md` becomes `/my-page.html`
- `index.md` becomes `/index.html`

## Customizing Templates

Edit `templates/base.html` to customize the site layout and styles.

Edit `templates/page.html` to control how individual pages are rendered.

The `navigation` variable contains the list of pages to display in the nav menu.

## Development Workflow

1. Start the dev server: `python build.py serve`
2. Edit Markdown files in `content/`
3. Edit templates in `templates/`
4. Changes automatically rebuild and are served on `http://localhost:8765`

## Building for Production

```bash
python build.py build
```

This generates clean HTML without debug information. Upload the `output/` directory to your web server.

## License

MIT
