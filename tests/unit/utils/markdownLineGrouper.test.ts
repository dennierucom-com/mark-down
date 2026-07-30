import { describe, it, expect } from 'vitest';
import { groupMarkdownLines } from '../../../src/utils/markdownLineGrouper';

describe('groupMarkdownLines', () => {
  it('should group empty lines as "empty" type blocks', () => {
    const content = '\n\n';
    const blocks = groupMarkdownLines(content);
    
    expect(blocks.length).toBe(3);
    expect(blocks[0].type).toBe('empty');
    expect(blocks[1].type).toBe('empty');
    expect(blocks[2].type).toBe('empty');
  });

  it('should correctly parse a code block', () => {
    const content = '```javascript\nconsole.log("Hello");\n```';
    const blocks = groupMarkdownLines(content);
    
    expect(blocks.length).toBe(1);
    expect(blocks[0].type).toBe('codeblock');
    expect(blocks[0].startLine).toBe(0);
    expect(blocks[0].endLine).toBe(2);
    expect(blocks[0].rawContent).toBe(content);
  });

  it('should correctly parse multiple contiguous text lines into one "group" block', () => {
    const content = 'Line 1\nLine 2\nLine 3';
    const blocks = groupMarkdownLines(content);
    
    expect(blocks.length).toBe(1);
    expect(blocks[0].type).toBe('group');
    expect(blocks[0].rawContent).toBe(content);
    expect(blocks[0].startLine).toBe(0);
    expect(blocks[0].endLine).toBe(2);
  });

  it('should handle mixed content properly', () => {
    const content = '# Heading\n\n```python\nprint("Test")\n```\n\nSome paragraph text.';
    const blocks = groupMarkdownLines(content);
    
    expect(blocks.length).toBe(5);
    // Block 0: Heading
    expect(blocks[0].type).toBe('group');
    expect(blocks[0].rawContent).toBe('# Heading');
    
    // Block 1: Empty line
    expect(blocks[1].type).toBe('empty');
    
    // Block 2: Code block
    expect(blocks[2].type).toBe('codeblock');
    expect(blocks[2].startLine).toBe(2);
    expect(blocks[2].endLine).toBe(4);
    
    // Block 3: Empty line
    expect(blocks[3].type).toBe('empty');
    
    // Block 4: Paragraph
    expect(blocks[4].type).toBe('group');
    expect(blocks[4].rawContent).toBe('Some paragraph text.');
  });
  
  it('should handle unclosed code block at EOF', () => {
    const content = '```js\nunclosed code';
    const blocks = groupMarkdownLines(content);
    
    expect(blocks.length).toBe(1);
    expect(blocks[0].type).toBe('codeblock');
    expect(blocks[0].rawContent).toBe(content);
  });
});
