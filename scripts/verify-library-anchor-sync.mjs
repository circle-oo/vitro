import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const treeCatalogPath = path.join(repoRoot, 'demo/src/pages/library/treeCatalog.ts');
const libraryDirPath = path.join(repoRoot, 'demo/src/pages/library');

const treeCatalogSource = fs.readFileSync(treeCatalogPath, 'utf8');
const nodeIds = new Set(
  [...treeCatalogSource.matchAll(/id:\s*'([^']+)'/g)]
    .map((match) => match[1])
    .filter((id) => id.includes(':')),
);

const anchorIds = new Set();
const anchorSectionPattern = /'(glass|layout|ui|data|chart|chat|feedback|hooks):[a-z0-9-]+'/g;

for (const fileName of fs.readdirSync(libraryDirPath)) {
  if (!fileName.endsWith('.tsx')) continue;

  const filePath = path.join(libraryDirPath, fileName);
  const source = fs.readFileSync(filePath, 'utf8');

  for (const match of source.matchAll(/getLibraryNodeAnchorId\('([^']+)'\)/g)) {
    anchorIds.add(match[1]);
  }

  for (const match of source.matchAll(anchorSectionPattern)) {
    anchorIds.add(match[0].slice(1, -1));
  }
}

const missingAnchors = [...nodeIds].filter((id) => !anchorIds.has(id)).sort();
const extraAnchors = [...anchorIds].filter((id) => !nodeIds.has(id)).sort();

if (missingAnchors.length > 0 || extraAnchors.length > 0) {
  console.error(
    `Library anchor sync check failed: ${nodeIds.size} tree nodes, ${anchorIds.size} anchors detected.`,
  );

  if (missingAnchors.length > 0) {
    console.error('\nMissing anchors for tree nodes:');
    for (const id of missingAnchors) {
      console.error(`- ${id}`);
    }
  }

  if (extraAnchors.length > 0) {
    console.error('\nAnchors not present in tree catalog:');
    for (const id of extraAnchors) {
      console.error(`- ${id}`);
    }
  }

  process.exit(1);
}

console.log(
  `Library anchor sync check passed (${nodeIds.size} tree nodes, ${anchorIds.size} anchors).`,
);
