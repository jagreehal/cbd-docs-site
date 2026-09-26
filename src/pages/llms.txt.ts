// The llms.txt format: an H1, an optional blockquote summary, then H2 sections
// listing [name](url): notes. That is the whole specification.
//
// This is generated from the same collection that renders the site, so it is
// derived output rather than an authored page and cannot disagree with the
// docs. Nothing needs to check it because nothing can make it drift.
//
// Do not claim agents discover documentation through this file. In the largest
// published measurement we know of, Evil Martians logged ~268k agent requests
// over two months and saw 37 llms.txt fetches from named AI assistants. The
// .md routes are the half with evidence behind them.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { docMeta } from '../doc-meta.ts';

export const GET: APIRoute = async ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL, site).href.replace(/\/$/, '');
  const docs = (await getCollection('docs')).sort((a, b) => a.id.localeCompare(b.id));
  const repos = [...new Set(docs.map((doc) => doc.id.split('/')[0]))].sort();

  const lines = [
    '# Acme documentation',
    '',
    '> Documents committed under docs/ in the Acme repositories tagged',
    '> cbd-publisher. Each link below is the raw markdown; its frontmatter names',
    '> the owner, the last git change, and the source file on GitHub.',
    '',
    `The same index as JSON, with links between documents: ${base}/contracts/docs-manifest.json`,
    '',
  ];

  for (const repo of repos) {
    lines.push(`## ${repo}`, '');
    for (const doc of docs.filter((entry) => entry.id.startsWith(`${repo}/`))) {
      const updated = docMeta(doc.id)?.updated?.slice(0, 10);
      lines.push(`- [${doc.data.title}](${base}/${doc.id}.md): owned by ${doc.data.owner}${updated ? `, changed ${updated}` : ''}`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
