// Every page is also published as raw markdown at <url>.md.
//
// This is the half of the agent story with evidence behind it. Agents ask for
// markdown when they can get it, using Accept: text/markdown. A static site
// cannot negotiate content, so the .md URL is how it offers the same thing.
import type { APIRoute } from 'astro';
import { stringify } from 'yaml';
import { docPaths, type DocProps } from '../paths.ts';

export const getStaticPaths = docPaths;

export const GET: APIRoute = ({ props }) => {
  // Serialised by the YAML library that parsed it, so a title with a colon in
  // it survives the round trip. Hand-built frontmatter is how that breaks.
  const { doc } = props as DocProps;
  return new Response(`---\n${stringify(doc.data)}---\n\n${doc.body}`, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
};
