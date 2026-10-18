# cbd-docs-site

Folded into **[cbd-catalog](https://github.com/jagreehal/cbd-catalog)**: https://jagreehal.github.io/cbd-catalog/

This repo built the company docs index with Starlight, while cbd-catalog built
EventCatalog. Both cloned the same repositories, so autocatalog now builds one
site that serves the docs, their `.md` twins, `llms.txt`,
`contracts/docs-manifest.json` and the contract catalog.

What is left here keeps old links working:

- Every page under https://jagreehal.github.io/cbd-docs-site/ redirects to the
  same path on cbd-catalog. GitHub Pages serves `404.html` for paths it does not
  have, and that page rewrites `/cbd-docs-site` to `/cbd-catalog`.
- [`contracts/docs-manifest.json`](https://jagreehal.github.io/cbd-docs-site/contracts/docs-manifest.json)
  is a copy of cbd-catalog's, refreshed hourly. JSON cannot redirect, and docs
  checks pinned to cbd-handbook `v1.0.0` still read it here. New readers should
  use https://jagreehal.github.io/cbd-catalog/contracts/docs-manifest.json.

A browser follows the redirect. An agent fetching an old `.md` twin gets the
HTML redirect page with a 404, so point agents at cbd-catalog.

The pattern and the argument behind it: [convention-based-design](https://github.com/jagreehal/convention-based-design).
