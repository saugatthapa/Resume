import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "artifacts", "resume-tools", "public");
const targetDir = path.join(rootDir, "public");
const sourceIndex = path.join(sourceDir, "index.html");
const targetIndex = path.join(targetDir, "index.html");

if (!fs.existsSync(sourceDir)) {
  console.error(`Missing frontend output directory: ${sourceDir}`);
  process.exit(1);
}

if (!fs.existsSync(sourceIndex)) {
  console.error(`Missing frontend entry file: ${sourceIndex}`);
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Copied Vercel frontend output from ${sourceDir} to ${targetDir}`);
console.log(`Verified target directory exists: ${fs.existsSync(targetDir)}`);
console.log(`Verified target index exists: ${fs.existsSync(targetIndex)}`);

if (!fs.existsSync(targetIndex)) {
  console.error(`Copy completed but missing target entry file: ${targetIndex}`);
  process.exit(1);
}
