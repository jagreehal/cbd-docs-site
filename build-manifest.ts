// The aggregator is a producer like any other: it consumes every repo's docs/
// and publishes contracts/docs-manifest.json under the same well-known path the
// convention reserves.
//
// The manifest is what lets a repo answer two questions it cannot answer alone:
// do my related links resolve, and is anyone linking to the file I am about to
// rename?
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { frontmatter, readDocs } from './read-docs.ts';

// The shape of the published artifact, declared once where it is written.
// src/manifest.ts imports this type rather than restating it, because a
// hand-written mirror of a generated artifact is the drift this repo is about.
export interface ManifestEntry {
  owner: string;
  title: string;
  updated: string | null;
  linkedFrom: string[];
}

const root = fileURLToPath(new URL('./repos', import.meta.url));
// Served by GitHub Pages at <site>/contracts/docs-manifest.json, the path every
// publishing repo's docs check fetches.
const contractsDir = fileURLToPath(new URL('./public/contracts', import.meta.url));

// Freshness is never a frontmatter field. git knows, and git cannot lie about
// it. Each enrolled repo is its own clone, with history.
const lastChanged = (file: string): string | null => {
  const [repo, ...pathParts] = file.split('/');
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', pathParts.join('/')], {
      cwd: `${root}/${repo}`,
      encoding: 'utf8',
    }).trim();
    return out || null;
  } catch {
    return null;
  }
};

export function buildManifest(): Record<string, ManifestEntry> {
  // Parsed, not cast. The builder refuses to publish a manifest describing a
  // doc that does not satisfy the contract; the publishing repo's CI reports why.
  const docs = readDocs(root).map((doc) => ({ ...doc, data: frontmatter.parse(doc.data) }));
  const manifest: Record<string, ManifestEntry> = {};

  for (const doc of docs) {
    manifest[doc.id] = {
      owner: doc.data.owner,
      title: doc.data.title,
      updated: lastChanged(doc.file),
      linkedFrom: [],
    };
  }

  for (const doc of docs) {
    for (const target of doc.data.related ?? []) {
      manifest[target]?.linkedFrom.push(doc.id);
    }
  }

  for (const entry of Object.values(manifest)) entry.linkedFrom.sort();
  return manifest;
}

// Two other modules import the type above. Writing to disk only when this file
// is the entry point keeps importing it free of side effects.
if (import.meta.main) {
  const manifest = buildManifest();
  mkdirSync(contractsDir, { recursive: true });
  writeFileSync(`${contractsDir}/docs-manifest.json`, JSON.stringify(manifest, null, 2) + '\n');

  const repos = new Set(Object.keys(manifest).map((id) => id.split('/')[0]));
  const count = Object.keys(manifest).length;
  console.log(`Wrote docs-manifest.json: ${count} doc(s) across ${repos.size} repo(s)`);
}
