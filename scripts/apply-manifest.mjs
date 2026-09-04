#!/usr/bin/env node
/**
 * Merges an enriched component definition into twilight-bundle.json while keeping the
 * generator-created `name` and `key` untouched (the key must never change once published).
 *
 * usage: node scripts/apply-manifest.mjs <component-name> <path-to-entry.json>
 */
import fs from 'node:fs';
import path from 'node:path';

const [, , name, entryPath] = process.argv;
if (!name || !entryPath) {
  console.error('usage: node scripts/apply-manifest.mjs <component-name> <entry.json>');
  process.exit(1);
}
const bundlePath = path.resolve(process.cwd(), 'twilight-bundle.json');
const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
const entry = JSON.parse(fs.readFileSync(path.resolve(entryPath), 'utf8'));
const idx = bundle.components.findIndex((c) => c.name === name);
if (idx === -1) {
  console.error(`component "${name}" not found — run tw-create-component first`);
  process.exit(1);
}
const existing = bundle.components[idx];
bundle.components[idx] = { ...existing, ...entry, name: existing.name, key: existing.key };
fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 4) + '\n');
console.log(`✅ manifest updated for ${name} (${(entry.fields || []).length} fields)`);
