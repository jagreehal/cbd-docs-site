// Every page is also published as raw markdown at <url>.md, and each HTML page
// points here with <link rel="alternate" type="text/markdown">.
//
// Agents ask for markdown when they can get it, using Accept: text/markdown. A
// static site on GitHub Pages cannot negotiate content, so the .md URL offers
// the same thing. The frontmatter carries what an agent needs to cite the page:
// the owner, the last git change, and the source file.
import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { stringify } from 'yaml';
import { docMeta } from '../doc-meta.ts';
import { frontmatter } from '../../read-docs.ts';

export async function getStaticPaths() {
  const docs = await getCollection('docs');
  return docs.map((doc) => ({ params: { slug: doc.id }, props: { doc } }));
}

// Starlight adds its own defaults to doc.data. Only the convention's fields
// belong in the twin.
const fields = Object.keys((frontmatter as unknown as { shape: object }).shape);

export const GET: APIRoute = ({ props, site }) => {
  const { doc } = props as { doc: CollectionEntry<'docs'> };
  const data = doc.data as Record<string, unknown>;
  const meta = docMeta(doc.id)!;
  const authored = Object.fromEntries(fields.filter((key) => data[key] !== undefined).map((key) => [key, data[key]]));
  // Serialised by the YAML library that parsed it, so a title with a colon in
  // it survives the round trip. Hand-built frontmatter is how that breaks.
  const yaml = stringify({
    ...authored,
    updated: meta.updated,
    source: meta.source,
    url: new URL(meta.html, site).href,
  });
  return new Response(`---\n${yaml}---\n\n${doc.body}`, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
};
