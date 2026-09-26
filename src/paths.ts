// One definition of the routes this site publishes, used by both the HTML page
// and the .md twin, so the two can never drift apart. Every rendered page is
// guaranteed to have raw markdown at the same path plus `.md`.
import { getCollection, type CollectionEntry } from 'astro:content';

export async function docPaths() {
  const docs = await getCollection('docs');
  return docs.map((doc) => ({ params: { slug: doc.id }, props: { doc } }));
}

export type DocProps = { doc: CollectionEntry<'docs'> };
