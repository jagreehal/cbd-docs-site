import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { frontmatter, type Frontmatter } from '../read-docs.ts';

const docs = defineCollection({
  // One collection, every enrolled repo, cloned into repos/ by `pnpm run repos`.
  loader: glob({
    base: './repos',
    pattern: '*/docs/**/*.md',
    // cbd-payments-service/docs/runbook.md -> cbd-payments-service/runbook
    generateId: ({ entry }) => entry.replace('/docs/', '/').replace(/\.md$/, ''),
  }),
  // z.custom defers to the artifact-derived schema rather than restating it
  // here. A hand-copied schema in the aggregator would be the stale copy this
  // whole repo argues against, and it would drift the first time
  // cbd-handbook changed.
  schema: z.custom<Frontmatter>((value) => frontmatter.safeParse(value).success, {
    message: 'frontmatter does not match cbd-handbook/contracts/docs-frontmatter.json',
  }),
});

export const collections = { docs };
