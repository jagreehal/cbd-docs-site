# cbd-docs-site

The company docs index: **https://jagreehal.github.io/cbd-docs-site/**

On every build it lists public repositories tagged `cbd-publisher`, clones
them, and renders every `docs/**/*.md` into one site with owners, git dates,
backlinks, raw `.md` routes, and `llms.txt`. It publishes
[`contracts/docs-manifest.json`](https://jagreehal.github.io/cbd-docs-site/contracts/docs-manifest.json),
which each publisher's docs check reads to catch broken cross-repo links.

It owns no documents and no publisher depends on it to build. Rebuilds hourly,
on push, and on demand (Actions → build → Run workflow).

```sh
pnpm install
pnpm run repos      # clone enrolled repos into repos/ (needs gh)
pnpm run manifest && pnpm run dev
```

## The six repositories

| Repo | Role |
|---|---|
| [cbd-handbook](https://github.com/jagreehal/cbd-handbook) | Owns the convention: docs frontmatter schema, docs checker, company policy |
| [cbd-payments-service](https://github.com/jagreehal/cbd-payments-service) | TypeScript producer: OpenAPI + event JSON Schemas + runbook |
| [cbd-dashboard](https://github.com/jagreehal/cbd-dashboard) | TypeScript consumer: typed client generated from the pinned OpenAPI |
| [cbd-reporter](https://github.com/jagreehal/cbd-reporter) | Python consumer: validates events against the pinned JSON Schemas |
| [cbd-docs-site](https://github.com/jagreehal/cbd-docs-site) | Aggregator: [one docs index](https://jagreehal.github.io/cbd-docs-site/) over every enrolled repo |
| [cbd-catalog](https://github.com/jagreehal/cbd-catalog) | Aggregator: [EventCatalog](https://jagreehal.github.io/cbd-catalog/) over every enrolled repo |

No repository imports another's source. Consumers read committed artifacts
at pinned tags over HTTPS; aggregators discover publishers by the
`cbd-publisher` GitHub topic.
