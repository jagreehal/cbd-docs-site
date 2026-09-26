// The manifest this site published on its last run. Pages read it for the
// last-changed date and for backlinks, both of which are facts about the whole
// company that no single repository holds.
//
// Imported rather than read from disk so it is bundled at build time. Run
// `pnpm run manifest` before building. The entry shape comes from the script
// that writes the file, so there is no second declaration to go stale.
import type { ManifestEntry } from '../build-manifest.ts';
import data from '../public/contracts/docs-manifest.json';

export type { ManifestEntry };
export const manifest: Record<string, ManifestEntry> = data;
