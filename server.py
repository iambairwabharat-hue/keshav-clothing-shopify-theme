import http.server
import socketserver
import os
import urllib.parse
import json

PORT = 3000
DIRECTORY = os.path.join(os.path.dirname(__file__), "theme")
DATA_DIR = os.path.join(DIRECTORY, "data")

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR, exist_ok=True)

PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")
COLLECTIONS_FILE = os.path.join(DATA_DIR, "collections.json")

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # REST API: GET Products
        if path == "/api/products":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            if os.path.exists(PRODUCTS_FILE):
                with open(PRODUCTS_FILE, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b"[]")
            return

        # REST API: GET Collections
        if path == "/api/collections":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            if os.path.exists(COLLECTIONS_FILE):
                with open(COLLECTIONS_FILE, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b"[]")
            return

        # Resolve clean URLs
        if path == "/" or path == "":
            self.path = "/index.html"
        elif not os.path.exists(os.path.join(DIRECTORY, path.lstrip("/"))) and os.path.exists(os.path.join(DIRECTORY, path.lstrip("/") + ".html")):
            self.path = path + ".html"
            if parsed.query:
                self.path += "?" + parsed.query

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        # REST API: POST / SAVE Products
        if path == "/api/products":
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(PRODUCTS_FILE, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "count": len(data)}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return

        # REST API: POST / SAVE Collections
        if path == "/api/collections":
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(COLLECTIONS_FILE, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "count": len(data)}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return

        self.send_response(404)
        self.end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), CleanURLHandler) as httpd:
        print(f"Serving NEVERMIND theme with Backend API at http://localhost:{PORT}")
        httpd.serve_forever()
