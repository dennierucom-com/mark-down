import { groupMarkdownLines } from './markdownLineGrouper';
import { resolveRelativePath } from './pathResolver';

export type LinkType = 'markdown' | 'wiki' | 'external';

export interface ExtractedLink {
  source: string;
  target: string;
  linkType: LinkType;
  anchor?: string;
  alias?: string;
}

export interface ExtractedHeading {
  text: string;
  level: number;
  id: string;
}

const WIKI_LINK_REGEX = /\[\[([^\]]+)\]\]/g;
const MARKDOWN_LINK_REGEX = /(?<!\\)\[((?:\\\]|[^\]])+)\]\(((?:\\\)|[^)])+)\)/g;
const HEADING_REGEX = /^(#{1,6})\s+(.+)$/gm;

// Helper to sanitize markdown heading to an ID
// Matching standard github/rehype-slug behavior
function sanitizeHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function stripInlineCode(content: string): string {
  // Replace anything between backticks with spaces to maintain indices if needed, 
  // but for simple extraction we can just remove it.
  // Using a simpler approach: remove inline code so links inside aren't matched.
  // This might break if there's backticks inside a link text, but usually links in code are just code.
  return content.replace(/`[^`]+`/g, '``');
}

export function parseMarkdownLinks(content: string, currentFilePath: string): ExtractedLink[] {
  const blocks = groupMarkdownLines(content);
  const links: ExtractedLink[] = [];

  for (const block of blocks) {
    if (block.type === 'codeblock' || block.type === 'empty') continue;

    // Remove inline code
    const textToSearch = stripInlineCode(block.rawContent);

    // 1. Extract WikiLinks
    let wikiMatch;
    while ((wikiMatch = WIKI_LINK_REGEX.exec(textToSearch)) !== null) {
      const inner = wikiMatch[1];
      const pipeIndex = inner.indexOf('|');

      let targetAndAnchor = inner;
      let alias: string | undefined = undefined;

      if (pipeIndex > -1) {
        targetAndAnchor = inner.substring(0, pipeIndex);
        alias = inner.substring(pipeIndex + 1);
      }

      let target = targetAndAnchor;
      let anchor: string | undefined = undefined;
      const actualHashIndex = targetAndAnchor.indexOf('#');
      
      if (actualHashIndex > -1) {
        target = targetAndAnchor.substring(0, actualHashIndex);
        anchor = targetAndAnchor.substring(actualHashIndex + 1);
      }

      target = target.trim();
      if (alias) alias = alias.trim();
      if (anchor) anchor = anchor.trim();

      links.push({
        source: currentFilePath,
        target: target === '' ? currentFilePath : target,
        linkType: 'wiki',
        anchor,
        alias
      });
    }

    // 2. Extract Standard Markdown Links
    let mdMatch;
    while ((mdMatch = MARKDOWN_LINK_REGEX.exec(textToSearch)) !== null) {
      const alias = mdMatch[1].replace(/\\\]/g, ']').replace(/\\\[/g, '['); // Unescape brackets
      const url = mdMatch[2].replace(/\\\)/g, ')');

      const isExternal = url.startsWith('http://') || url.startsWith('https://');
      const linkType: LinkType = isExternal ? 'external' : 'markdown';

      let target = url;
      let anchor: string | undefined = undefined;

      const hashIndex = url.indexOf('#');
      if (hashIndex > -1 && !isExternal) {
        target = url.substring(0, hashIndex);
        anchor = url.substring(hashIndex + 1);
      } else if (hashIndex > -1 && isExternal) {
        // keep hash in target for external links, or separate it? Let's keep it separated for consistency or keep in target.
        // Actually, ticket says external URLs should be distinguishable.
      }

      target = isExternal ? url : resolveRelativePath(currentFilePath, target);

      links.push({
        source: currentFilePath,
        target: target === '' ? currentFilePath : target,
        linkType,
        anchor,
        alias
      });
    }
  }

  return links;
}

export function extractHeadings(content: string): ExtractedHeading[] {
  const blocks = groupMarkdownLines(content);
  const headings: ExtractedHeading[] = [];

  for (const block of blocks) {
    if (block.type === 'codeblock' || block.type === 'empty') continue;

    const textToSearch = block.rawContent;

    let match;
    while ((match = HEADING_REGEX.exec(textToSearch)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      
      headings.push({
        level,
        text,
        id: sanitizeHeadingId(text),
      });
    }
  }

  return headings;
}
