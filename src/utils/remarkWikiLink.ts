import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text, PhrasingContent } from 'mdast';

/**
 * A remark plugin that transforms WikiLink syntax ([[Target]] and [[Target|Alias]])
 * into standard markdown link nodes so react-markdown can render them as clickable <a> tags.
 * 
 * Examples:
 *   [[Welcome.md]]           → <a href="Welcome.md">Welcome.md</a>
 *   [[Welcome.md|My Alias]]  → <a href="Welcome.md">My Alias</a>
 *   [[Welcome.md#Section]]   → <a href="Welcome.md#Section">Welcome.md#Section</a>
 *   [[Missing Feature]]      → <a href="Missing Feature">Missing Feature</a>
 */
const remarkWikiLink: Plugin<[], Root> = () => {
  const WIKI_LINK_REGEX = /\[\[([^\]]+)\]\]/g;

  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === undefined) return;

      const value = node.value;
      const matches = [...value.matchAll(WIKI_LINK_REGEX)];

      if (matches.length === 0) return;

      const children: PhrasingContent[] = [];
      let lastIndex = 0;

      for (const match of matches) {
        const fullMatch = match[0];
        const inner = match[1];
        const matchStart = match.index!;

        // Text before this match
        if (matchStart > lastIndex) {
          children.push({
            type: 'text',
            value: value.slice(lastIndex, matchStart),
          });
        }

        // Parse the inner content: [[target|alias]] or [[target#anchor]]
        const pipeIndex = inner.indexOf('|');
        let target: string;
        let alias: string;

        if (pipeIndex > -1) {
          target = inner.substring(0, pipeIndex).trim();
          alias = inner.substring(pipeIndex + 1).trim();
        } else {
          target = inner.trim();
          alias = inner.trim();
        }

        // Create a link node
        children.push({
          type: 'link',
          url: target,
          title: null,
          data: {
            hProperties: { 'data-wiki-link': 'true' },
          },
          children: [{ type: 'text', value: alias }],
        } as PhrasingContent);

        lastIndex = matchStart + fullMatch.length;
      }

      // Remaining text after last match
      if (lastIndex < value.length) {
        children.push({
          type: 'text',
          value: value.slice(lastIndex),
        });
      }

      // Replace the original text node with the new children
      parent.children.splice(index, 1, ...children);
    });
  };
};

export default remarkWikiLink;
