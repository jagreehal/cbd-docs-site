// Shared by build-manifest.ts and src/content.config.ts. Reads the enrolled
// repositories that `pnpm run repos` cloned into repos/.
//
// A doc is addressed by its path, never by a declared id:
//   repos/cbd-payments-service/docs/runbook.md    -> cbd-payments-service/runbook
//   repos/cbd-payments-service/docs/ops/replay.md -> cbd-payments-service/ops/replay
import { globSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { z } from 'zod';

// The committed artifact from cbd-handbook (itself enrolled), never its Zod
// source. cbd-reporter reads this same file with jsonschema.
export const frontmatter = z.fromJSONSchema(
  JSON.parse(
    readFileSync(
      fileURLToPath(new URL('./repos/cbd-handbook/contracts/docs-frontmatter.json', import.meta.url)),
      'utf8'
    )
  )
);

export type Frontmatter = z.infer<typeof frontmatter>;

export interface Doc {
  id: string;
  repo: string;
  file: string;
  /** Raw parsed frontmatter. Unvalidated on purpose — a file on disk can hold
   *  anything, and validating it is the publishing repo's CI check's whole job. */
  data: unknown;
  body: string;
}

// Frontmatter is YAML, so it is parsed by a YAML parser. A hand-rolled reader
// for "the subset we use today" is the same mistake as a hand-copied type: it
// works until the first title with a colon in it, and then it fails quietly.
export function readDocs(root: string): Doc[] {
  return globSync('*/docs/**/*.md', { cwd: root })
    .sort()
    .map((file) => {
      const [repo, , ...rest] = file.split('/');
      const text = readFileSync(`${root}/${file}`, 'utf8');
      const match = /^---\n(.*?)\n---\n/s.exec(text);
      if (!match) throw new Error(`${file}: no frontmatter`);
      return {
        id: `${repo}/${rest.join('/').replace(/\.md$/, '')}`,
        repo,
        file,
        data: parse(match[1]) ?? {},
        body: text,
      };
    });
}
