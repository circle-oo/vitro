import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const distEntry = path.resolve(process.cwd(), 'dist/index.js');
const sourceEntry = path.resolve(process.cwd(), 'src/index.ts');
const mod = await import(pathToFileURL(distEntry).href);

function parseRuntimeExports(source) {
  const exportNames = new Set();
  const exportRegex = /export\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"];?/g;

  let match = exportRegex.exec(source);
  while (match) {
    const names = match[1]
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const aliasParts = entry.split(/\s+as\s+/i);
        return aliasParts[1] ?? aliasParts[0];
      });

    names.forEach((name) => exportNames.add(name));
    match = exportRegex.exec(source);
  }

  return [...exportNames].sort((a, b) => a.localeCompare(b));
}

const sourceText = await readFile(sourceEntry, 'utf8');
const requiredExports = parseRuntimeExports(sourceText);
const runtimeExports = new Set(Object.keys(mod));

const missing = requiredExports.filter((key) => !runtimeExports.has(key));
const unexpected = [...runtimeExports].filter((key) => !requiredExports.includes(key));

if (missing.length > 0) {
  console.error(`Missing expected exports: ${missing.join(', ')}`);
  process.exit(1);
}

if (unexpected.length > 0) {
  console.error(`Unexpected runtime exports not declared in src/index.ts: ${unexpected.join(', ')}`);
  process.exit(1);
}

console.log(`Verified ${requiredExports.length} runtime exports against src/index.ts`);
