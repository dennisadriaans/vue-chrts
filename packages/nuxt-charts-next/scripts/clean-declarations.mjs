import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

async function clean(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await clean(path);
    else if (entry.name.endsWith(".d.vue.ts")) await rm(path);
  }
}

await clean(fileURLToPath(new URL("../dist", import.meta.url)));
