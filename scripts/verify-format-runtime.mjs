import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const distEntry = pathToFileURL(path.resolve(scriptDir, '../dist/index.js')).href;

const {
  formatDateTime,
  formatTime,
  formatIsoDateTime,
  formatDateText,
} = await import(distEntry);

const locales = ['ko', 'en', 'fr', 'ja'];
const checks = [
  {
    name: 'formatDateTime',
    run: (locale) => formatDateTime('2026-02-18 19:04:16', locale),
  },
  {
    name: 'formatTime',
    run: (locale) => formatTime('19:04:16', locale),
  },
  {
    name: 'formatIsoDateTime',
    run: (locale) => formatIsoDateTime('2026-02-18T19:04:16.000Z', locale),
  },
  {
    name: 'formatDateText',
    run: (locale) => formatDateText('2026-02-18', locale),
  },
];

for (const locale of locales) {
  for (const check of checks) {
    try {
      const output = check.run(locale);
      if (typeof output !== 'string' || output.length === 0) {
        throw new Error(`Unexpected output: ${String(output)}`);
      }
    } catch (error) {
      console.error(`[verify-format-runtime] ${check.name} failed for locale "${locale}"`);
      console.error(error);
      process.exit(1);
    }
  }
}

console.log('[verify-format-runtime] All formatting checks passed.');
