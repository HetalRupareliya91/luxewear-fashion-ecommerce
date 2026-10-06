// Finds every tests/**/*.test.ts and runs them with Node's built-in test runner + tsx.
// Works the same on Windows, macOS and Linux (no shell globbing needed).
import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function collect(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return collect(full);
    return name.endsWith(".test.ts") ? [full] : [];
  });
}

const files = collect("tests");
if (files.length === 0) {
  console.error("No test files found in ./tests");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--import", "tsx", "--test", ...files], { stdio: "inherit" });
process.exit(result.status ?? 1);
