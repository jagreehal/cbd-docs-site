# cbd-docs-site

The company docs index: **https://jagreehal.github.io/cbd-docs-site/**

Each build lists the public repositories tagged `cbd-publisher`, clones them,
and renders their `docs/**/*.md` into one site. Pages show the owner, the last
git change and backlinks, with a raw `.md` twin and an `llms.txt` index. The
build also publishes
[`contracts/docs-manifest.json`](https://jagreehal.github.io/cbd-docs-site/contracts/docs-manifest.json).
Each publisher's docs check reads it to catch broken cross-repo links.

This repo owns no documents, and publishers build without it. GitHub Actions
rebuilds it hourly, on push, and when you run the workflow by hand.

```sh
pnpm install
pnpm run repos      # clone enrolled repos into repos/ (needs gh)
pnpm run manifest && pnpm run dev
```

## The six repositories

| Repo | Role |
|---|---|
| [cbd-handbook](https://github.com/jagreehal/cbd-handbook) | Owns the convention: docs frontmatter schema, docs check, company policy |
| [cbd-payments-service](https://github.com/jagreehal/cbd-payments-service) | TypeScript producer: OpenAPI, event JSON Schemas, runbook |
| [cbd-dashboard](https://github.com/jagreehal/cbd-dashboard) | TypeScript consumer: generates a typed client from the pinned OpenAPI |
| [cbd-reporter](https://github.com/jagreehal/cbd-reporter) | Python consumer: validates events against the pinned JSON Schemas |
| [cbd-docs-site](https://github.com/jagreehal/cbd-docs-site) | Aggregator: [docs index](https://jagreehal.github.io/cbd-docs-site/) over the enrolled repos |
| [cbd-catalog](https://github.com/jagreehal/cbd-catalog) | Aggregator: [EventCatalog](https://jagreehal.github.io/cbd-catalog/) over the enrolled repos |

Consumers fetch committed artifacts over HTTPS at a pinned tag. The
aggregators find publishers by the `cbd-publisher` GitHub topic.
