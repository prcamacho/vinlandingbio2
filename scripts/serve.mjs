import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".ttf": "font/ttf" };
createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, "http://localhost");
    const pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname !== "/" && !["/index.html", "/styles.css", "/app.js", "/browser-help.js", "/analytics.js"].includes(pathname) && !pathname.startsWith("/assets/")) {
      response.writeHead(404).end("Not found"); return;
    }
    const path = resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (!path.startsWith(root + sep) || !(await stat(path)).isFile()) {
      response.writeHead(404).end("Not found"); return;
    }
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end(); return;
    }
    let data = await readFile(path);
    const preview = requestUrl.searchParams.get("preview");
    // Device previews exist only in the local server, never in the published site.
    if (pathname === "/" && ["instagram-ios", "instagram-android"].includes(preview)) {
      const agent = preview === "instagram-ios"
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Instagram"
        : "Mozilla/5.0 (Linux; Android 15) Instagram";
      const previewScript = `<script type="module">import { setupInstagramHelp } from "./browser-help.js"; setupInstagramHelp(${JSON.stringify(agent)});</script>`;
      data = Buffer.from(data.toString("utf8").replace('<script src="browser-help.js" type="module"></script>', previewScript));
    }
    response.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff" });
    response.end(request.method === "HEAD" ? undefined : data);
  } catch { response.writeHead(404).end("Not found"); }
}).listen(port, "127.0.0.1", () => console.log(`Local: http://localhost:${port}`));
