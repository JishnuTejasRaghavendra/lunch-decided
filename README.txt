LUNCH, DECIDED. — LOCAL WEBSITE

WHAT'S INCLUDED
- server.py: tiny local server that reads your dish list and serves the website.
- data/dishes.txt: your editable menu, one dish per line.
- static/index.html: page structure.
- static/styles.css: design and responsive layout.
- static/app.js: random weighted picker and local history.

HOW TO RUN (WINDOWS)
1. Install Python 3 if it is not already installed.
2. Extract this folder somewhere convenient.
3. Open the folder in File Explorer.
4. Click the address bar, type cmd, and press Enter.
5. Run: python server.py
6. Open http://localhost:8000 in your browser.
7. Keep the terminal window open while using the site. Press Ctrl+C there to stop it.

HOW TO UPDATE THE MENU
Open data/dishes.txt in Notepad or another text editor. Put exactly one dish on each line, save, then refresh the website. Blank lines are ignored. Lines starting with # are comments. You do not need to edit any code.

HOW THE PICKING WORKS
- Dishes eaten recently are assigned a lower probability.
- They are never completely excluded, so repeats can happen naturally.
- History is stored in this browser on this device using localStorage. It survives refreshes and normal browser restarts, but clearing site data or using another browser/device resets it.
- The latest 12 picks are saved; the latest 7 influence the weighting most.

TROUBLESHOOTING
- If `python server.py` does not work, try `py server.py` on Windows.
- Do not open index.html by double-clicking it; use http://localhost:8000 so the menu file can be read.
- If you edit dishes.txt, refresh the page to reload the list.
