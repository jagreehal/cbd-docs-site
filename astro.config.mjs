import starlight from '@astrojs/starlight';
import { existsSync, globSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlightThemeNova from 'starlight-theme-nova';
import rehypeTwinkleplop from '@twinkleplop/rehype';
import { language as bash } from '@twinkleplop/bash';
import { language as json } from '@twinkleplop/json';
import remarkDropTitle from './src/remark-drop-title.mjs';

// One sidebar group per enrolled repository, company handbook first. The list
// comes from what `pnpm run repos` cloned, so enrolling a repo adds a group.
const cloned = new URL('./repos', import.meta.url);
const repos = (existsSync(cloned) ? readdirSync(cloned) : [])
  .filter((repo) => existsSync(new URL(`./repos/${repo}/docs`, import.meta.url)))
  .sort((a, b) => (a === 'cbd-handbook' ? -1 : b === 'cbd-handbook' ? 1 : a.localeCompare(b)));

export default defineConfig({
  site: 'https://jagreehal.github.io',
  base: '/cbd-docs-site/',
  markdown: {
    // Twinkleplop highlights instead of Shiki. Fences in other languages stay
    // as plain blocks.
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkDropTitle],
      rehypePlugins: [
        [rehypeTwinkleplop, { languages: { sh: bash(), json: json() }, on_unknown_language: 'plain' }],
      ],
    }),
  },
  integrations: [
    starlight({
      plugins: [starlightThemeNova()],
      title: 'Acme docs',
      description: 'Operational and technical documentation from each enrolled repository.',
      favicon: '/favicon.svg',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/jagreehal/cbd-docs-site' }],
      expressiveCode: false,
      customCss: ['@twinkleplop/theme-github', './src/code.css'],
      components: {
        Head: './src/components/Head.astro',
        PageTitle: './src/components/PageTitle.astro',
        MarkdownContent: './src/components/MarkdownContent.astro',
      },
      sidebar: [
        { label: 'Start here', link: '/' },
        // Autogenerate only sees Starlight's own docs directory, so list the
        // slugs from each clone. Starlight fills in each page's title.
        ...repos.map((repo) => ({
          label: repo,
          items: globSync('docs/**/*.md', { cwd: `repos/${repo}` })
            .sort()
            .map((file) => `${repo}/${file.replace(/^docs\//, '').replace(/\.md$/, '')}`),
        })),
      ],
    }),
  ],
});
