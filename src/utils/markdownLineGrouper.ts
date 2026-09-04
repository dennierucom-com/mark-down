export interface MarkdownBlock {
  id: string;
  startLine: number; // 0-indexed
  endLine: number; // 0-indexed, inclusive
  rawContent: string;
  type: 'empty' | 'codeblock' | 'group';
}

export function groupMarkdownLines(content: string): MarkdownBlock[] {
  const lines = content.split('\n');
  const blocks: MarkdownBlock[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trim().startsWith('```')) {
      const startLine = i;
      let rawContent = line;
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        rawContent += '\n' + lines[i];
        i++;
      }
      if (i < lines.length) {
        rawContent += '\n' + lines[i];
        i++;
      }
      blocks.push({
        id: `block-${startLine}`,
        startLine,
        endLine: i - 1,
        rawContent,
        type: 'codeblock',
      });
      continue;
    }

    if (line.trim() === '') {
      blocks.push({
        id: `block-${i}`,
        startLine: i,
        endLine: i,
        rawContent: line,
        type: 'empty',
      });
      i++;
      continue;
    }

    const startLine = i;
    let rawContent = line;
    i++;
    
    // Prevent massive blocks that lag the editor during rendering/editing
    const MAX_LINES = 100;
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].trim().startsWith('```') && (i - startLine) < MAX_LINES) {
      rawContent += '\n' + lines[i];
      i++;
    }
    
    blocks.push({
      id: `block-${startLine}`,
      startLine,
      endLine: i - 1,
      rawContent,
      type: 'group',
    });
  }

  return blocks;
}
