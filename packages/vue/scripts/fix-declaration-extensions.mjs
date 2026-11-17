import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])(\.{1,2}\/[^"']*)\2/g;

function resolveSpecifier(fromFile, specifier) {
  if (/\.(m|c)?js$/.test(specifier)) return specifier;
  const base = resolve(dirname(fromFile), specifier);
  if (existsSync(`${base}.d.ts`)) return `${specifier}.js`;
  if (existsSync(join(base, "index.d.ts"))) return `${specifier.replace(/\/$/, "")}/index.js`;
  return specifier;
}

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (entry.name.endsWith(".d.ts")) files.push(path);
  }
  return files;
}

const unresolved = [];
for (const file of await collect(fileURLToPath(new URL("../dist", import.meta.url)))) {
  const source = await readFile(file, "utf8");
  const output = source.replace(SPECIFIER, (match, prefix, quote, specifier) => {
    const next = resolveSpecifier(file, specifier);
    if (next === specifier && !/\.(m|c)?js$/.test(specifier)) unresolved.push(`${file}: ${specifier}`);
    return `${prefix}${quote}${next}${quote}`;
  });
  if (output !== source) await writeFile(file, output);
}

if (unresolved.length) {
  console.error(`Unresolved relative declaration imports:\n${unresolved.join("\n")}`);
  process.exit(1);
}
