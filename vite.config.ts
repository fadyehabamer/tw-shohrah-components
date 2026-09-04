import { defineConfig, type Plugin } from 'vite';
import { resolve, dirname, relative } from 'node:path';
import {
  sallaBuildPlugin,
  sallaDemoPlugin,
  sallaTransformPlugin,
} from '@salla.sa/twilight-bundles/vite-plugins';

/**
 * Every component under src/components/<name>/ must build to ONE self-contained file
 * (dist/<name>.js) because the storefront loads them individually from the CDN.
 * Rollup would otherwise hoist anything imported by two or more components
 * (our src/shared helpers) into a shared chunk that the CDN path scheme cannot serve.
 *
 * This plugin gives each component its own private copy of every shared module by
 * appending an `?owner=<component>` query to shared imports (and to the shared
 * modules' own relative imports), so Rollup treats them as distinct modules.
 * Build-only; the dev server serves modules individually and needs no inlining.
 */
function inlineSharedPerComponent(): Plugin {
  const root = process.cwd();
  const sharedDir = resolve(root, 'src/shared');
  const componentsDir = resolve(root, 'src/components');
  const ownerOf = (id: string): string | null => {
    const clean = id.split('?')[0];
    const rel = relative(componentsDir, clean);
    if (!rel.startsWith('..') && !rel.startsWith('/')) return rel.split(/[\\/]/)[0];
    const q = id.match(/[?&]owner=([a-z0-9-]+)/);
    return q ? q[1] : null;
  };
  return {
    name: 'shohrah-inline-shared',
    enforce: 'pre',
    apply: 'build',
    async resolveId(source, importer) {
      if (!importer || !source.startsWith('.')) return null;
      const owner = ownerOf(importer);
      if (!owner) return null;
      const abs = resolve(dirname(importer.split('?')[0]), source);
      if (!abs.startsWith(sharedDir)) return null;
      const resolved = await this.resolve(abs, importer, { skipSelf: true });
      if (!resolved) return null;
      return `${resolved.id.split('?')[0]}?owner=${owner}`;
    },
  };
}

/** Host-theme tokens injected into the demo page so components render as they would inside a real theme. */
const demoThemeTokens = `
  :root {
    --color-primary: #1f5c5a;
    --color-primary-dark: #174846;
    --color-primary-light: #2f7f7b;
    --color-primary-reverse: #ffffff;
    --font-main: "PingARLT", "DINNextLTArabic", system-ui, sans-serif;
    --s-radius: .75rem;
  }
  body { font-family: var(--font-main); }
`;

export default defineConfig({
  plugins: [
    sallaTransformPlugin(),
    inlineSharedPerComponent(),
    sallaBuildPlugin(),
    sallaDemoPlugin({
      grid: {
        columns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '1.5rem',
        minWidth: '360px',
      },
      formbuilder: { languages: ['ar', 'en'], defaultLanguage: 'ar' },
      css: demoThemeTokens,
    }),
  ],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    emptyOutDir: true,
  },
});
