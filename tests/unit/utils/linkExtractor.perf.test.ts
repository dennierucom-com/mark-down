import { describe, it, expect } from 'vitest';
import { parseMarkdownLinks, extractHeadings } from '../../../src/utils/linkExtractor';

function generateLargeMarkdown(targetSizeKb: number): string {
  let content = '';
  const linesPerKb = 20; // approximate
  const totalLines = targetSizeKb * linesPerKb;
  
  for (let i = 0; i < totalLines; i++) {
    if (i % 10 === 0) {
      content += `# Heading ${i}\n`;
    } else if (i % 5 === 0) {
      content += `Here is a [link to file ${i}](./file${i}.md) with some text.\n`;
    } else if (i % 7 === 0) {
      content += `Here is a [[WikiLink${i}]] test.\n`;
    } else if (i % 11 === 0) {
      content += `\`\`\`\n[Fake Link](fake.md)\n\`\`\`\n`;
    } else {
      content += `This is just some random paragraph text for line ${i}. It has no links or anything special.\n`;
    }
  }
  
  return content;
}

describe('linkExtractor performance', () => {
  it('should parse a 40 KB file in less than 3ms', () => {
    // Generate roughly 40KB string
    const markdown = generateLargeMarkdown(40);
    // Ensure size is somewhat accurate (~40,000 chars)
    expect(markdown.length).toBeGreaterThan(25000);

    const iterations = 30;
    const currentPath = 'docs/notes/perf.md';
    let totalTime = 0;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      parseMarkdownLinks(markdown, currentPath);
      extractHeadings(markdown);
      const end = performance.now();
      totalTime += (end - start);
    }

    const averageTime = totalTime / iterations;
    
    // Performance expectation
    expect(averageTime).toBeLessThan(3);
    
    console.log(`Average parse time for ~40KB file: ${averageTime.toFixed(2)} ms`);
  });
});
