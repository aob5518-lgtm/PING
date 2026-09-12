#!/usr/bin/env python3
"""Small dependency-free static server with Expo Router SPA fallback."""

import argparse
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True
    allow_reuse_address = True
    request_queue_size = 128


class PingHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        requested_path = self.translate_path(self.path)
        if not os.path.exists(requested_path):
            self.path = "/"
        return super().send_head()

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "same-origin")
        if self.path.startswith("/_expo/"):
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")
        else:
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=80)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("0.0.0.0", args.port), PingHandler)
    print("Ping listening on port {}".format(args.port), flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
