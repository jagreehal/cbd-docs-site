/**
 * Publishing repos open each doc with `# Title` so it reads well on GitHub.
 * Starlight renders the title from frontmatter, so the site drops the first
 * H1 to avoid showing it twice. The .md twin keeps the file as written.
 */
export default function remarkDropTitle() {
  return (tree) => {
    const first = tree.children.findIndex((node) => node.type === 'heading');
    if (first !== -1 && tree.children[first].depth === 1) tree.children.splice(first, 1);
  };
}
