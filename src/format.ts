// The index and the doc page both show the same git date in the same format.
export const day = (iso?: string | null): string | null =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
