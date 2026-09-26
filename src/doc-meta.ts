// What a reader, human or agent, needs to trust a page: who owns it, when git
// last saw it change, and where the source lives. The HTML page, the <head>
// link, the .md twin and llms.txt all read it from here.
import { manifest } from './manifest.ts';

const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export const docMeta = (id: string) => {
  const entry = manifest[id];
  if (!entry) return null;
  const [repo, ...rest] = id.split('/');
  return {
    ...entry,
    repo,
    html: `${base}${id}/`,
    markdown: `${base}${id}.md`,
    source: `https://github.com/jagreehal/${repo}/blob/main/docs/${rest.join('/')}.md`,
  };
};
