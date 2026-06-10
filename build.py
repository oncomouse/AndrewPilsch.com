#!/usr/bin/env python3
"""
Markdown to Website Converter
Converts markdown files with frontmatter into static HTML using Jinja2 templates.
"""

import os
import sys
import argparse
import re
import shutil
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime
import frontmatter
import markdown
from jinja2 import Environment, FileSystemLoader
import http.server
import socketserver
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class MarkdownBuilder:
    def __init__(
        self,
        content_dir: str = "content",
        templates_dir: str = "templates",
        output_dir: str = "output",
        debug: bool = False,
    ):
        self.content_dir = Path(content_dir)
        self.templates_dir = Path(templates_dir)
        self.output_dir = Path(output_dir)
        self.debug = debug

        self.output_dir.mkdir(exist_ok=True)

        self.jinja_env = Environment(loader=FileSystemLoader(str(self.templates_dir)))

    def get_url_from_filename(self, filename: str) -> str:
        """Convert markdown filename to URL-safe format with lowercase and dashes."""
        name = filename.replace(".md", "")
        name = name.lower()
        name = re.sub(r"[^a-z0-9]+", "-", name)
        name = name.strip("-")
        if name == "index":
            return "index.html"
        return f"{name}.html"

    def parse_markdown_files(self) -> List[Dict]:
        """Parse all markdown files and extract metadata."""
        pages = []

        for md_file in sorted(self.content_dir.glob("*.md")):
            with open(md_file, "r", encoding="utf-8") as f:
                post = frontmatter.load(f)

            metadata = post.metadata
            content = post.content

            url = self.get_url_from_filename(md_file.name)

            page = {
                "filename": md_file.name,
                "url": url,
                "title": metadata.get("title", md_file.stem.replace("-", " ").title()),
                "order": metadata.get("order", float("inf")),
                "nav": metadata.get("nav", True),
                "css": metadata.get("css", None),
                "content": content,
                "metadata": metadata,
            }
            pages.append(page)

        return pages

    def build_navigation(self, pages: List[Dict]) -> List[Dict]:
        """Build navigation menu from pages with nav=True, sorted by order."""
        nav_pages = [p for p in pages if p["nav"]]
        nav_pages.sort(key=lambda x: (x["order"], x["title"]))
        return [{"title": p["title"], "url": p["url"]} for p in nav_pages]

    def convert_markdown_to_html(self, markdown_text: str) -> str:
        """Convert markdown to HTML."""
        return markdown.markdown(
            markdown_text, extensions=["extra", "codehilite", "toc"]
        )

    def build_page(self, page: Dict, navigation: List[Dict]) -> str:
        """Render a single page using templates."""
        html_content = self.convert_markdown_to_html(page["content"])

        context = {
            "title": page["title"],
            "content": html_content,
            "navigation": navigation,
            "debug": self.debug,
            "debug_info": f"<!-- Built: {datetime.now().isoformat()} | Source: {page['filename']} -->"
            if self.debug
            else "",
        }

        template = self.jinja_env.get_template("page.html")
        return template.render(context)

    def copy_css_files(self) -> None:
        """Copy CSS files from templates directory to output directory."""
        for css_file in self.templates_dir.glob("*.css"):
            output_file = self.output_dir / css_file.name
            with open(css_file, "r", encoding="utf-8") as f:
                content = f.read()
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"  ✓ {css_file.name} → {css_file.name}")

    def copy_static_files(self) -> None:
        """Copy static directory (fonts, etc.) to output directory."""
        static_dir = Path("static")
        if static_dir.exists():
            output_static = self.output_dir / "static"
            if output_static.exists():
                shutil.rmtree(output_static)
            shutil.copytree(static_dir, output_static)
            print(f"  ✓ static/ → static/")

    def build(self) -> None:
        """Build all pages."""
        print(f"Building from {self.content_dir}...")

        pages = self.parse_markdown_files()
        if not pages:
            print(f"No markdown files found in {self.content_dir}")
            return

        navigation = self.build_navigation(pages)

        for page in pages:
            html = self.build_page(page, navigation)
            output_file = self.output_dir / page["url"]

            with open(output_file, "w", encoding="utf-8") as f:
                f.write(html)

            print(f"  ✓ {page['filename']} → {page['url']}")

        self.copy_css_files()
        self.copy_static_files()

        print(f"\nBuild complete! Output in {self.output_dir}")


class RebuildHandler(FileSystemEventHandler):
    """Watch for changes and rebuild."""

    def __init__(self, builder: MarkdownBuilder):
        self.builder = builder

    def _should_rebuild(self, event):
        """Check if this event should trigger a rebuild."""
        filename = Path(event.src_path).name
        if filename.startswith("."):
            return False
        if event.src_path.endswith((".md", ".html", ".css")):
            return True
        if "static" in event.src_path:
            return True
        return False

    def on_modified(self, event):
        if not event.is_directory and self._should_rebuild(event):
            print(
                f"\n[{datetime.now().strftime('%H:%M:%S')}] Detected change: {Path(event.src_path).name}"
            )
            self.builder.build()

    def on_created(self, event):
        if not event.is_directory and self._should_rebuild(event):
            print(
                f"\n[{datetime.now().strftime('%H:%M:%S')}] Detected new file: {Path(event.src_path).name}"
            )
            self.builder.build()

    def on_deleted(self, event):
        if not event.is_directory and self._should_rebuild(event):
            print(
                f"\n[{datetime.now().strftime('%H:%M:%S')}] Detected deleted file: {Path(event.src_path).name}"
            )
            self.builder.build()


def run_dev_server(port: int = 8765, output_dir: str = "output") -> None:
    """Run a simple HTTP server."""
    output_path = Path(output_dir)

    class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(output_path), **kwargs)

        def log_message(self, format, *args):
            print(f"[{datetime.now().strftime('%H:%M:%S')}] {format % args}")

    class ReuseTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    handler = CustomHTTPRequestHandler
    with ReuseTCPServer(("", port), handler) as httpd:
        print(f"Dev server running at http://localhost:{port}")
        print(f"Serving from {output_path}")
        print("Press Ctrl+C to stop\n")
        httpd.serve_forever()


def main():
    parser = argparse.ArgumentParser(
        description="Convert markdown files to static HTML website"
    )
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    build_parser = subparsers.add_parser("build", help="Build static site")
    build_parser.add_argument(
        "--debug", action="store_true", help="Include debug info in HTML"
    )

    serve_parser = subparsers.add_parser(
        "serve", help="Run dev server with auto-rebuild"
    )
    serve_parser.add_argument(
        "--port", type=int, default=8765, help="Port for dev server (default: 8765)"
    )
    serve_parser.add_argument(
        "--debug", action="store_true", help="Include debug info in HTML"
    )

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    if args.command == "build":
        builder = MarkdownBuilder(debug=args.debug)
        builder.build()

    elif args.command == "serve":
        builder = MarkdownBuilder(debug=True)
        builder.build()

        observer = Observer()
        observer.schedule(
            RebuildHandler(builder), path=str(builder.content_dir), recursive=False
        )
        observer.schedule(
            RebuildHandler(builder), path=str(builder.templates_dir), recursive=False
        )
        observer.schedule(
            RebuildHandler(builder), path="static", recursive=True
        )
        observer.start()

        server_thread = threading.Thread(
            target=run_dev_server, args=(args.port,), daemon=True
        )
        server_thread.start()

        try:
            observer.join()
        except KeyboardInterrupt:
            print("\nShutting down...")
            observer.stop()
            observer.join()


if __name__ == "__main__":
    main()
