#!/usr/bin/env python3
"""
ScraperTool.py - Chrome HTML Scraper for Test Automation (async edition)
─────────────────────────────────────────────────────────────────────────
Usage:
    python ScraperTool.py --url <url> --project <project_name>

Example:
    python ScraperTool.py --url https://demo.nopcommerce.com/ --project MyProject

Controls (while scraper is running):
    F9       = manual snapshot (captures current DOM state — use for modals,
               dropdowns, validation errors, any state that doesn't change URL)
    Ctrl+C   = stop scraper

Output:
    {project}/HTML/{page}_{timestamp}_nav.html    <- auto-captured on URL change
    {project}/HTML/{page}_{timestamp}_snap.html   <- F9 manual snapshot

Login state:
    Chrome profile is saved in {project}/Profile/ so you only need to log in
    once per project. Subsequent runs remember your session.
"""

import argparse
import asyncio
import re
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

# ── Dependency checks ──────────────────────────────────────────────────────────

try:
    from playwright.async_api import async_playwright, BrowserContext, Page
except ImportError:
    print("ERROR: playwright not installed.")
    print("Run:   pip install playwright")
    print("Then:  playwright install chromium")
    sys.exit(1)

try:
    import keyboard
except ImportError:
    print("ERROR: keyboard not installed.")
    print("Run:   pip install keyboard")
    sys.exit(1)

# ── Configuration ──────────────────────────────────────────────────────────────

SNAPSHOT_HOTKEY  = "f9"
POLL_INTERVAL    = 0.5   # seconds between URL-change checks
NAV_SETTLE_DELAY = 1.2   # seconds to wait after URL changes before capturing

# ── Helpers ────────────────────────────────────────────────────────────────────

def sanitize_url(url: str) -> str:
    parsed = urlparse(url)
    segment = parsed.path.strip("/") or "home"
    if parsed.fragment:
        segment = f"{segment}__{parsed.fragment}"
    segment = re.sub(r"[^\w\-]", "_", segment)
    segment = re.sub(r"_+", "_", segment).strip("_")
    return segment[:80] or "home"


def make_filename(url: str, capture_type: str) -> str:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{sanitize_url(url)}_{ts}_{capture_type}.html"


async def capture_and_save(page: Page, html_dir: Path,
                            capture_type: str, label: str = "") -> None:
    try:
        url = page.url
        if url.startswith(("about:", "chrome:", "devtools:")):
            return
        html = await page.evaluate("() => document.documentElement.outerHTML")
        filename = make_filename(url, capture_type)
        (html_dir / filename).write_text(html, encoding="utf-8")
        tag = f" [{label}]" if label else ""
        print(f"  ✓ Saved{tag}: {filename}")
    except Exception as e:
        print(f"  ! Capture error: {e}")


def scaffold_project(base_dir: Path, project_name: str) -> dict:
    project_dir = base_dir / project_name
    paths = {}
    for folder in ["HTML", "Design", "POM", "Framework", "Tests", "Results", "Profile"]:
        p = project_dir / folder
        p.mkdir(parents=True, exist_ok=True)
        paths[folder] = p
    print(f"Project ready: {project_dir}")
    return paths

# ── Core scraper ───────────────────────────────────────────────────────────────

async def run(url: str, project: str) -> None:
    base_dir = Path(__file__).parent
    paths       = scaffold_project(base_dir, project)
    html_dir    = paths["HTML"]
    profile_dir = paths["Profile"]

    # asyncio.Queue bridges the keyboard thread → async event loop safely.
    # The hotkey callback (runs in a background OS thread) calls
    # loop.call_soon_threadsafe(), which schedules the put onto the loop
    # without touching any async internals from the wrong thread.
    loop       = asyncio.get_running_loop()
    snap_queue: asyncio.Queue = asyncio.Queue()

    def on_hotkey():
        loop.call_soon_threadsafe(snap_queue.put_nowait, "snap")

    keyboard.add_hotkey(SNAPSHOT_HOTKEY, on_hotkey)

    print("Launching Chrome...")

    async with async_playwright() as pw:
        context: BrowserContext = await pw.chromium.launch_persistent_context(
            user_data_dir=str(profile_dir),
            channel="chrome",
            headless=False,
            args=[
                "--no-first-run",
                "--no-default-browser-check",
                "--start-maximized",
            ],
            no_viewport=True,
        )

        page: Page = context.pages[0] if context.pages else await context.new_page()
        await page.goto(url, wait_until="domcontentloaded")

        try:
            await page.wait_for_load_state("networkidle", timeout=8000)
        except Exception:
            pass

        print(f"\n{'─' * 60}")
        print(f"  Scraper active")
        print(f"  Project : {project}")
        print(f"  Saving  : {html_dir}")
        print(f"  F9      : manual snapshot")
        print(f"  Ctrl+C  : stop")
        print(f"{'─' * 60}\n")

        # Capture the initial page
        await capture_and_save(page, html_dir, "nav", "initial")
        last_url = page.url

        # ── Main async loop ────────────────────────────────────────────────────
        try:
            while True:
                await asyncio.sleep(POLL_INTERVAL)

                # Active page = most recently opened tab
                cur_page: Page = context.pages[-1] if context.pages else page

                # ── Handle F9 snapshots (safe — we're on the event loop now) ──
                while not snap_queue.empty():
                    await snap_queue.get()
                    print("  [F9 — capturing state...]")
                    await capture_and_save(cur_page, html_dir, "snap", "manual")

                # ── Detect URL change (covers SPAs and hash routing) ───────────
                try:
                    current_url = cur_page.url
                except Exception:
                    continue

                if (current_url != last_url
                        and not current_url.startswith(("about:", "chrome:"))):
                    last_url = current_url
                    await asyncio.sleep(NAV_SETTLE_DELAY)
                    await capture_and_save(cur_page, html_dir, "nav")

        except asyncio.CancelledError:
            pass
        finally:
            keyboard.unhook_all()
            print(f"\nScraper stopped. Files saved to: {html_dir}")
            try:
                await context.close()
            except Exception:
                pass


# ── Entry point ────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Chrome HTML Scraper for Test Automation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--url",     required=True, help="Starting URL")
    parser.add_argument("--project", required=True, help="Project name")
    args = parser.parse_args()

    try:
        asyncio.run(run(args.url, args.project))
    except KeyboardInterrupt:
        pass   # clean Ctrl+C — message already printed inside run()


if __name__ == "__main__":
    main()
