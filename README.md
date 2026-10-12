# Lunch, Decided

A small animated lunch picker that gives recently selected dishes a lower chance without permanently excluding them. Your recent picks are stored in your browser with `localStorage`.

## Deploy on Cloudflare Pages from GitHub

Create a Cloudflare Pages project connected to this repository and use these settings:

- **Framework preset:** None
- **Production branch:** `main`
- **Build command:** `node build.mjs`
- **Build output directory:** `dist`
- **Root directory:** leave blank (repository root)

The build copies the website files from `static/` and the menu from `data/dishes.txt` into `dist/`. Cloudflare Pages serves that output as a static website; it does not need to run `server.py`.

Every push to the connected production branch will trigger a new deployment.

## Run locally on Windows

1. Install Python 3.
2. Open this project folder in File Explorer.
3. Click the address bar, type `cmd`, and press Enter.
4. Run `python server.py` (or `py server.py`).
5. Open `http://localhost:8000` in your browser.

Keep the terminal open while using the local site. Press Ctrl+C to stop the server.

## Edit the menu

Edit `data/dishes.txt`, putting one dish on each line. Blank lines and lines beginning with `#` are ignored.

- **Local:** save the file and refresh the page.
- **Cloudflare Pages:** commit and push the changed file to GitHub; Pages rebuilds and deploys the updated menu.

## Project structure

- `static/index.html` — page structure
- `static/styles.css` — styling and animations
- `static/app.js` — picker logic and browser history
- `data/dishes.txt` — editable dish list
- `server.py` — lightweight local development server
- `build.mjs` — creates the static Cloudflare Pages output
- `dist/` — generated at build time; do not commit it

## How picking works

Dishes picked recently have lower selection weights, but can still be picked again. The most recent 12 picks are saved in this browser; the latest 7 influence the weighting. Browser storage is local to that browser/device.
