// Leonida Trophy Atlas — local preview server.
//
// Serves app/ at its root so the guide can be tried in desktop Chrome:
//   node serve.ts
// then open http://localhost:8080
// The served app makes no network request; everything it loads is a file
// under app/.

import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(join(fileURLToPath(import.meta.url), "..", "app"));
const port = Number(process.env.PORT || 8080);

const mimeByExtension = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = createServer((request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
  const wanted = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = join(appRoot, normalize(wanted).replace(/^(\.\.[/\\])+/, ""));
  if (!filePath.startsWith(appRoot) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found: " + urlPath + "\n");
    return;
  }
  const body = readFileSync(filePath);
  response.writeHead(200, { "content-type": mimeByExtension[extname(filePath)] || "application/octet-stream" });
  response.end(body);
});

server.listen(port, "127.0.0.1", () => {
  console.log("Leonida Trophy Atlas at http://localhost:" + port);
});
