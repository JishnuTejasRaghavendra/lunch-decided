import { cp, mkdir, rm, copyFile } from "node:fs/promises";
import path from "node:path";

// Build a deploy-ready static site for Cloudflare Pages.
const root = process.cwd();
const output = path.join(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, "static"), output, { recursive: true });
await copyFile(path.join(root, "data", "dishes.txt"), path.join(output, "dishes.txt"));
console.log("Cloudflare Pages site built in ./dist");
