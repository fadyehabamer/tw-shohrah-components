#!/usr/bin/env node
/**
 * Generates docs/FIELD-REFERENCE.md from twilight-bundle.json and the per-component locale.ts files,
 * so the field reference and translator key list can never drift from the shipped manifest.
 *
 * usage: node scripts/gen-field-reference.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const bundle = JSON.parse(fs.readFileSync(path.join(root, 'twilight-bundle.json'), 'utf8'));

const fmtDefault = (f) => {
  if (f.type === 'items') {
    const sel = Array.isArray(f.selected) ? f.selected.map((o) => `\`${o.value}\``).join(', ') : '';
    return sel || (f.source && f.source !== 'Manual' ? `— (source: ${f.source})` : '—');
  }
  if (f.type === 'collection') return `${Array.isArray(f.value) ? f.value.length : 0} rows`;
  const v = f.value;
  if (v == null || v === '') return '—';
  if (typeof v === 'object') return `ar: “${v.ar ?? ''}” · en: “${v.en ?? ''}”`;
  return `\`${String(v)}\``;
};

const typeOf = (f) => {
  let t = `${f.type}/${f.format ?? ''}`.replace(/\/$/, '');
  if (f.multilanguage) t += ' · multilanguage';
  if (f.type === 'items' && f.source && f.source !== 'Manual') t += ` · source: ${f.source}`;
  if (f.type === 'items' && f.multichoice) t += ' · multi';
  return t;
};

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

let out = `# Field reference\n\n`;
out += `Generated from \`twilight-bundle.json\` by \`scripts/gen-field-reference.mjs\` — do not edit by hand.\n\n`;
out += `Bundle: **${bundle.name?.en}** / **${bundle.name?.ar}** — ${bundle.components.length} components.\n\n`;

for (const c of bundle.components) {
  const fields = (c.fields || []).filter((f) => f.type !== 'static');
  out += `## \`${c.name}\` — ${c.title}\n\n`;
  out += `Tag: \`<salla-${c.name}>\` · key: \`${c.key}\` · icon: \`${c.icon}\` · ${fields.length} editable fields\n\n`;
  out += `| id | type | label (editor) | default |\n|---|---|---|---|\n`;
  for (const f of fields) {
    out += `| \`${f.id}\` | ${esc(typeOf(f))} | ${esc(f.label ?? '')} | ${esc(fmtDefault(f))} |\n`;
    if (f.type === 'collection') {
      for (const sf of f.fields || []) {
        out += `| ↳ \`${f.id}[].${sf.id}\` | ${esc(typeOf(sf))} | ${esc(sf.label ?? '')} | ${esc(fmtDefault(sf))} |\n`;
      }
    }
  }
  // translation keys from locale.ts
  const localePath = path.join(root, 'src/components', c.name, 'locale.ts');
  if (fs.existsSync(localePath)) {
    const src = fs.readFileSync(localePath, 'utf8');
    const keys = [...src.matchAll(/^\s{2}([a-z0-9_]+):\s*\{/gm)].map((m) => m[1]);
    out += `\n**Translation keys** (registered as \`shohrah.${c.name}.<key>\`, override with \`salla.lang.set()\`):\n\n`;
    out += keys.map((k) => `\`${k}\``).join(', ') + '\n';
  }
  out += '\n';
}

fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/FIELD-REFERENCE.md'), out);
console.log(`✅ docs/FIELD-REFERENCE.md written (${bundle.components.length} components)`);
