from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data" / "dishes.txt"

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / "static"), **kwargs)

    def do_GET(self):
        # Map the static site's dishes.txt request to the editable source file.
        if self.path.split('?', 1)[0] == "/dishes.txt":
            try:
                payload = DATA_FILE.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.send_header("Content-Length", str(len(payload)))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(payload)
            except OSError as exc:
                self.send_error(500, f"Could not read data/dishes.txt: {exc}")
            return
        return super().do_GET()

if __name__ == "__main__":
    print("Lunch Picker is running at http://localhost:8000")
    print("Keep this window open. Press Ctrl+C to stop.")
    ThreadingHTTPServer(("127.0.0.1", 8000), Handler).serve_forever()
