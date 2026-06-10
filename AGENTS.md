# OpenCode Agents Guide

This file provides essential context for developers and AI agents working with this repository.

## Project Overview

This is a **Markdown to Website Converter** — a Python-based static site generator that converts Markdown files with YAML frontmatter into a professional HTML website with templating and automatic navigation.

## Repository Structure

```
new-webpage/
├── build.py              # Main build script (Python 3)
├── requirements.txt      # Python dependencies
├── biome.json           # Code formatter config
├── content/             # Markdown source files
├── templates/           # Jinja2 HTML templates
├── static/              # Static assets (fonts, images, etc.)
├── output/              # Generated HTML (git-ignored)
├── README.md            # User documentation
└── AGENTS.md            # This file
```

## Key Technologies

- **Python 3.14+** with dependencies:
  - `markdown` - Markdown to HTML conversion
  - `python-frontmatter` - Parse YAML frontmatter
  - `Jinja2` - HTML templating
  - `watchdog` - File system monitoring
- **Biome** - Code formatting

## Development Setup

1. Create and activate virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Key Commands

### Build
- `python build.py build` - Build static site to `output/` directory
- `python build.py build --debug` - Build with debug info in HTML

### Development
- `python build.py serve` - Start dev server on port 8765 with auto-rebuild
- `python build.py serve --port <PORT>` - Start dev server on custom port
- `python build.py serve --debug` - Enable debug mode (enabled by default for serve)

### Code Quality
- `biome check .` - Check code formatting
- `biome format .` - Format code

## Important Implementation Details

### Build System (build.py)

The `MarkdownBuilder` class handles:
- Parsing Markdown files from `content/` directory
- Extracting YAML frontmatter for metadata (title, order, nav, css)
- Converting Markdown to HTML with extensions (extra, codehilite, toc)
- Rendering pages using `templates/page.html`
- Copying CSS files from `templates/` to `output/`
- Copying entire `static/` directory to `output/static/`
- Generating navigation menu from pages with `nav: true`

### File Watching (RebuildHandler)

The `RebuildHandler` watches for changes and triggers rebuilds on:
- Any `.md` files in `content/`
- Any `.html` files in `templates/`
- Any `.css` files in `templates/`
- All files in `static/` directory (recursive, with dotfile filtering)

Rebuilds are skipped for:
- Hidden files (starting with `.`)
- Temporary/transient files

### Dev Server

The dev server:
- Runs on port 8765 by default (configurable)
- Serves the `output/` directory
- Uses `SO_REUSEADDR` to allow port reuse after restart
- Logs requests with timestamps

## Best Practices

- Always test builds with `python build.py build` before deploying
- Use `python build.py serve` during development for live preview
- Keep Markdown files simple and well-structured with proper frontmatter
- Store static assets (images, fonts, downloads) in `static/` directory
- Customize site design by editing templates in `templates/`
- Follow biome formatting rules: `biome format .`

## Git Workflow

- Commit frequently with clear, descriptive messages
- Use standard feature branch workflow
- Never commit the `output/` directory (it's git-ignored)
- Never commit the `venv/` directory
