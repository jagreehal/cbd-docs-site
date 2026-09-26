import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsSchema } from '@astrojs/starlight/schema';
import { artifact } from '../read-docs.ts';

const docs = defineCollection({
  // One collection, every enrolled repo, cloned into repos/ by `pnpm run repos`.
  loader: glob({
    base: './repos',
    pattern: '*/docs/**/*.md',
    // cbd-payments-service/docs/runbook.md -> cbd-payments-service/runbook
    generateId: ({ entry }) => entry.replace('/docs/', '/').replace(/\.md$/, ''),
  }),
  // Starlight extends the handbook's artifact with its own optional fields, so
  // the site restates none of the convention and keeps it strict: an unknown
  // key still fails the build. Built with Astro's zod, because Starlight's
  // defaults only apply when both schemas come from the same zod instance.
  schema: docsSchema({ extend: z.fromJSONSchema(artifact) as z.ZodObject }),
});

export const collections = { docs };
