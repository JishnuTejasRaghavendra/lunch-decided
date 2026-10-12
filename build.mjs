import { cp, mkdir, rm, copyFile } from "node:fs/promises";
import path from "node:path";

// Keep the menu beside index.html so it works whether Cloudflare Pages is
// configured to publish ./static directly or the generated ./dist folder.
const root = process.cwd();
const staticDir = path.join(root, "static");
const sourceMenu = path.join(root, "data", "dishes.txt");
const output = path.join(root, "dist");

await copyFile(sourceMenu, path.join(staticDir, "dishes.txt"));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(staticDir, output, { recursive: true });
console.log("Cloudflare Pages site built in ./dist (menu available in ./static and ./dist)");
