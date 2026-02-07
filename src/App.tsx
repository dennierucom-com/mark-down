import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { sampleMarkdown } from './sampleMarkdown';
import 'highlight.js/styles/github-dark.css';
import './App.css';

function App() {
  const [markdownContent, setMarkdownContent] = useState<string>(() => {
    return localStorage.getItem('markdown_content') || sampleMarkdown;
  });
  const [fileName, setFileName] = useState<string>(() => {
    return localStorage.getItem('markdown_filename') || 'sample.md';
  });
  const [filePath, setFilePath] = useState<string>(() => {
    return localStorage.getItem('markdown_path') || '';
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('markdown_content', markdownContent);
  }, [markdownContent]);

  useEffect(() => {
    localStorage.setItem('markdown_filename', fileName);
  }, [fileName]);

  useEffect(() => {
    localStorage.setItem('markdown_path', filePath);
  }, [filePath]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.md')) {
      readFileContent(file);
    } else {
      alert('Please select a valid markdown (.md) file');
    }
  };

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdownContent(content);
      setFileName(file.name);
      // Try to get path if available (e.g. Electron), otherwise fallback to name
      const path = (file as any).path || file.name;
      setFilePath(path);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.md')) {
      readFileContent(file);
    } else {
      alert('Please drop a valid markdown (.md) file');
    }
  };

  const resetToSample = () => {
    setMarkdownContent(sampleMarkdown);
    setFileName('sample.md');
    setFilePath('');
  };

  return (
    <div
      className={`app-container ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="app-header">
        <h1>📝 Markdown Reader</h1>
        <p className="subtitle">View your markdown files with style</p>
      </header>

      <div className="controls">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="file-upload"
            accept=".md,.markdown"
            onChange={handleFileUpload}
            className="file-input"
          />
          <label htmlFor="file-upload" className="file-label">
            📁 Choose File
          </label>
        </div>

        <span className="current-file">Current: <strong>{fileName}</strong></span>

        <button onClick={resetToSample} className="reset-button">
          🔄 Reset to Sample
        </button>
      </div>

      <div className="markdown-container">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>

      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">
            📂 Drop your markdown file here
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
