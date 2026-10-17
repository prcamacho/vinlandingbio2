import { cp, mkdir, copyFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "dist");
await mkdir(out, { recursive: true });
for (const file of ["index.html", "styles.css", "app.js", "browser-help.js"]) await copyFile(resolve(root, file), resolve(out, file));
await cp(resolve(root, "assets"), resolve(out, "assets"), { recursive: true });
console.log("Landing lista en dist/");
