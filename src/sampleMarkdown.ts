export const sampleMarkdown = `# Markdown Reader Demo 📝

Welcome to the **Markdown Reader**! This is a sample markdown document showcasing various markdown features.

## Features Supported

### Text Formatting
- **Bold text** using \`**bold**\`
- *Italic text* using \`*italic*\`
- ***Bold and Italic*** using \`***bold italic***\`
- ~~Strikethrough~~ using \`~~strikethrough~~\`
- \`Inline code\` using backticks

### Lists

#### Unordered List
- First item
- Second item
  - Nested item 1
  - Nested item 2
- Third item

#### Ordered List
1. First step
2. Second step
3. Third step

### Code Blocks

Here's a JavaScript example:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to Markdown Reader\`;
}

greet('Developer');
\`\`\`

TypeScript example:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};
\`\`\`

### Tables

| Feature | Supported | Priority |
|---------|-----------|----------|
| Headers | ✅ Yes | High |
| Lists | ✅ Yes | High |
| Code Highlighting | ✅ Yes | Medium |
| Tables | ✅ Yes | Medium |
| Images | ✅ Yes | Low |
| Links | ✅ Yes | High |

### Links
- [Google](https://www.google.com)
- [GitHub](https://github.com)
- [React Documentation](https://react.dev)

### Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> > Nested blockquotes are also supported!

### Horizontal Rules

---

### Task Lists
- [x] Create project structure
- [x] Add markdown parser
- [x] Implement file upload
- [ ] Add dark mode
- [ ] Add export functionality

---

## How to Use

1. **View Default Sample**: You're currently viewing this default markdown sample
2. **Upload File**: Click the "Choose File" button to upload your own .md file
3. **Drag & Drop**: Or simply drag and drop a markdown file anywhere on the page

---

## More Examples

### Emphasized Text

This is a paragraph with *emphasis* and **strong importance**. You can also combine them for ***extra emphasis***.

### Inline HTML (if supported)
HTML tags might work depending on the configuration:
<strong>Bold using HTML</strong>

---

**Happy Reading! 🎉**
`;
