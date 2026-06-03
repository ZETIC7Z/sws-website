import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const VERCEL_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BACKEND_DIR = join(process.cwd(), "dist-backend");

// Create temporary directory
try {
  mkdirSync(BACKEND_DIR, { recursive: true });
} catch {}

// Write vercel.json
const vercelJson = {
  version: 2,
  builds: [
    { src: "server.mjs", use: "@vercel/node" }
  ],
  routes: [
    { src: "/(.*)", dest: "server.mjs" }
  ]
};

writeFileSync(join(BACKEND_DIR, "vercel.json"), JSON.stringify(vercelJson, null, 2));

// Copy files
writeFileSync(join(BACKEND_DIR, "server.mjs"), readFileSync(join(process.cwd(), "server.mjs")));
writeFileSync(join(BACKEND_DIR, "package.json"), readFileSync(join(process.cwd(), "package.json")));

console.log("✅ dist-backend files prepared.");
