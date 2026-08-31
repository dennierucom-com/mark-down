import { describe, it, expect } from 'vitest';
import { parseMarkdownLinks, extractHeadings } from '../../../src/utils/linkExtractor';

describe('linkExtractor', () => {
  const currentPath = 'docs/notes/test.md';

  describe('parseMarkdownLinks', () => {
    it('extracts standard markdown link', () => {
      const links = parseMarkdownLinks('[Text](path/to/file.md)', currentPath);
      expect(links).toHaveLength(1);
      expect(links[0]).toEqual(expect.objectContaining({
        target: 'docs/notes/path/to/file.md',
        alias: 'Text',
        linkType: 'markdown'
      }));
    });

    it('extracts relative markdown link with ./', () => {
      const links = parseMarkdownLinks('[Text](./file.md)', currentPath);
      expect(links[0].target).toBe('docs/notes/file.md');
    });

    it('extracts relative markdown link with ../', () => {
      const links = parseMarkdownLinks('[Text](../file.md)', currentPath);
      expect(links[0].target).toBe('docs/file.md');
    });

    it('extracts WikiLink', () => {
      const links = parseMarkdownLinks('[[Note Name]]', currentPath);
      expect(links[0]).toEqual(expect.objectContaining({
        target: 'Note Name',
        linkType: 'wiki'
      }));
    });

    it('extracts WikiLink with alias', () => {
      const links = parseMarkdownLinks('[[Note Name|Alias]]', currentPath);
      expect(links[0].target).toBe('Note Name');
      expect(links[0].alias).toBe('Alias');
    });

    it('extracts WikiLink with anchor', () => {
      const links = parseMarkdownLinks('[[Note Name#Section Header]]', currentPath);
      expect(links[0].target).toBe('Note Name');
      expect(links[0].anchor).toBe('Section Header');
    });

    it('extracts WikiLink with anchor and alias', () => {
      const links = parseMarkdownLinks('[[Note Name#Section Header|Alias]]', currentPath);
      expect(links[0].target).toBe('Note Name');
      expect(links[0].anchor).toBe('Section Header');
      expect(links[0].alias).toBe('Alias');
    });

    it('extracts markdown link with anchor', () => {
      const links = parseMarkdownLinks('[Text](file.md#section-header)', currentPath);
      expect(links[0].target).toBe('docs/notes/file.md');
      expect(links[0].anchor).toBe('section-header');
    });

    it('extracts external HTTP URL', () => {
      const links = parseMarkdownLinks('[Google](http://google.com)', currentPath);
      expect(links[0].target).toBe('http://google.com');
      expect(links[0].linkType).toBe('external');
    });

    it('extracts external HTTPS URL', () => {
      const links = parseMarkdownLinks('[Google](https://google.com)', currentPath);
      expect(links[0].target).toBe('https://google.com');
      expect(links[0].linkType).toBe('external');
    });

    it('handles escaped brackets', () => {
      const links = parseMarkdownLinks('[\\[Text\\]](file.md)', currentPath);
      expect(links[0].alias).toBe('[Text]');
      expect(links[0].target).toBe('docs/notes/file.md');
    });

    it('ignores link-like text inside fenced code blocks', () => {
      const markdown = `
\`\`\`markdown
[Text](file.md)
[[Note]]
\`\`\`
      `;
      const links = parseMarkdownLinks(markdown, currentPath);
      expect(links).toHaveLength(0);
    });

    it('ignores link-like text inside inline code', () => {
      const markdown = `Here is \`[Text](file.md)\` inline code.`;
      const links = parseMarkdownLinks(markdown, currentPath);
      expect(links).toHaveLength(0);
    });
  });

  describe('extractHeadings', () => {
    it('extracts headings and normalizes IDs', () => {
      const markdown = `
# Header Title
## Sub Header
### Another One!
      `;
      const headings = extractHeadings(markdown);
      expect(headings).toHaveLength(3);
      
      expect(headings[0]).toEqual({ level: 1, text: 'Header Title', id: 'header-title' });
      expect(headings[1]).toEqual({ level: 2, text: 'Sub Header', id: 'sub-header' });
      expect(headings[2]).toEqual({ level: 3, text: 'Another One!', id: 'another-one' });
    });

    it('ignores headings in code blocks', () => {
      const markdown = `
\`\`\`
# Not a header
\`\`\`
      `;
      const headings = extractHeadings(markdown);
      expect(headings).toHaveLength(0);
    });
  });
});
