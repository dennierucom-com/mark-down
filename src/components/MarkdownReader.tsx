import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  useTheme,
  Tooltip,
  GlobalStyles,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import CheckIcon from "@mui/icons-material/Check";
import type { Components } from "react-markdown";
import { useSearch } from "../context/SearchContext";

interface MarkdownReaderProps {
  content: string;
  onContentChange?: (newContent: string) => void;
}

import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import EditIcon from "@mui/icons-material/Edit";
import { InputBase, ClickAwayListener } from "@mui/material";
import { groupMarkdownLines, type MarkdownBlock } from "../utils/markdownLineGrouper";

// ... (existing helper functions)

const MarkdownReader: React.FC<MarkdownReaderProps> = ({ content, onContentChange }) => {
  const theme = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isElectricMode, setIsElectricMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { searchTerm, setTotalMatches, currentMatchIndex } = useSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  const blocks = React.useMemo(() => groupMarkdownLines(content), [content]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleElectricMode = () => {
    setIsElectricMode(!isElectricMode);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setEditingBlockId(null);
    }
  };

  const handleSaveBlock = (block: MarkdownBlock) => {
    if (editValue !== block.rawContent && onContentChange) {
      const lines = content.split('\n');
      lines.splice(block.startLine, block.endLine - block.startLine + 1, ...editValue.split('\n'));
      onContentChange(lines.join('\n'));
    }
    setEditingBlockId(null);
  };

  // Effect to handle fullscreen change (ESQ key, etc.)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Effect to count matches and handle navigation
  useEffect(() => {
    if (!containerRef.current) return;

    // Give React time to render the marks
    const timeout = setTimeout(() => {
      const matches = containerRef.current?.querySelectorAll("mark");
      if (matches) {
        setTotalMatches(matches.length);

        // Apply active class and scroll
        matches.forEach((match, index) => {
          if (index === currentMatchIndex) {
            match.style.backgroundColor = theme.custom.search.activeHighlight;
            match.style.color = theme.custom.search.highlightText;
            match.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            match.style.backgroundColor = theme.custom.search.highlight;
            match.style.color = theme.custom.search.highlightText;
          }
        });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [
    content,
    searchTerm,
    currentMatchIndex,
    setTotalMatches,
    theme.custom.search.activeHighlight,
    theme.custom.search.highlight,
    theme.custom.search.highlightText,
  ]);

  // Helper to highlight text
  const HighlightText = ({ text }: { text: string }) => {
    if (!searchTerm || !text) return <>{text}</>;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <mark
              key={i}
              style={{
                backgroundColor: theme.custom.search.highlight,
                color: theme.custom.search.highlightText,
                borderRadius: 2,
              }}
            >
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  // Wrapper for text-containing elements
  const TextWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <>
        {React.Children.map(children, (child) => {
          if (typeof child === "string") {
            return <HighlightText text={child} />;
          }
          return child;
        })}
      </>
    );
  };
  // Inline code renderer — only handles backtick spans like `&`
  const InlineCode = ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    return (
      <code
        className={className}
        {...props}
        style={{
          backgroundColor: theme.palette.action.hover,
          padding: "2px 4px",
          borderRadius: "4px",
          fontFamily: "monospace",
        }}
      >
        {children}
      </code>
    );
  };

  // WCAG AAA-compliant high-contrast code syntax styles
  const syntaxHighlightStyles = {
    'pre code.hljs': {
      color: '#1f2937 !important',
      backgroundColor: 'transparent !important',
      fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, monospace !important',
      fontSize: '0.875rem !important',
      lineHeight: '1.6 !important',
    },
    '.hljs-keyword, .hljs-selector-tag, .hljs-subst': {
      color: '#ac0d1a !important',
      fontWeight: 'bold !important',
    },
    '.hljs-string, .hljs-regexp, .hljs-symbol, .hljs-bullet, .hljs-addition': {
      color: '#07336f !important',
    },
    '.hljs-comment, .hljs-quote, .hljs-deletion': {
      color: '#4b5563 !important',
      fontStyle: 'italic !important',
    },
    '.hljs-number, .hljs-literal, .hljs-type, .hljs-built_in': {
      color: '#803000 !important',
    },
    '.hljs-title, .hljs-section, .hljs-name': {
      color: '#5c2dc5 !important',
      fontWeight: '600 !important',
    },
    '.hljs-attr, .hljs-attribute, .hljs-variable, .hljs-template-variable, .hljs-tag': {
      color: '#02479e !important',
    },
    '.hljs-operator, .hljs-punctuation': {
      color: '#1f2937 !important',
    },
    '.hljs-meta, .hljs-meta .hljs-keyword': {
      color: '#5c2dc5 !important',
    },
    '.hljs-emphasis': {
      fontStyle: 'italic !important',
    },
    '.hljs-strong': {
      fontWeight: 'bold !important',
    },
  };

  // Block code renderer — wraps fenced code blocks (```...```)
  // In react-markdown, block code is always rendered as <pre><code>...</code></pre>.
  // By overriding `pre`, we capture the block wrapper and add our custom UI.
  const PreBlock = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLPreElement>) => {
    const codeRef = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      if (codeRef.current) {
        navigator.clipboard.writeText(codeRef.current.innerText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    // Extract the language from the inner <code> element's className
    let language = "text";
    if (React.isValidElement(children)) {
      const childClassName =
        (children.props as { className?: string })?.className || "";
      const match = /language-(\w+)/.exec(childClassName);
      if (match) language = match[1];
    }

    return (
      <Box sx={{ position: "relative", mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 0,
            overflow: "hidden",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          }}
        >
          {/* Header Bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, monospace',
                fontWeight: 600,
                color: "#64748b",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
              }}
            >
              {language}
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy code"}>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{
                  color: "#64748b",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: "#0f172a",
                    backgroundColor: "#e2e8f0",
                  },
                }}
              >
                {copied ? (
                  <CheckIcon fontSize="small" sx={{ color: "#10b981" }} />
                ) : (
                  <ContentCopyIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          {/* Code Content */}
          <Box
            sx={{
              p: 2,
              overflowX: "auto",
              backgroundColor: "#ffffff",
              "& pre": {
                margin: 0,
                fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, monospace',
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "#1f2937",
              },
            }}
          >
            <pre ref={codeRef} {...props}>
              {children}
            </pre>
          </Box>
        </Paper>
      </Box>
    );
  };

  const components: Components = {
    code: InlineCode,
    pre: PreBlock,

    p: ({ children }) => (
      <Typography paragraph component="div">
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h1: ({ children }) => (
      <Typography variant="h1" gutterBottom>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography variant="h2" gutterBottom>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h3" gutterBottom>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h4: ({ children }) => (
      <Typography variant="h4" gutterBottom>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h5: ({ children }) => (
      <Typography variant="h5" gutterBottom>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h6: ({ children }) => (
      <Typography variant="h6" gutterBottom>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    li: ({ children }) => (
      <li>
        <Typography component="span">
          <TextWrapper>{children}</TextWrapper>
        </Typography>
      </li>
    ),
    strong: ({ children }) => (
      <Box
        component="strong"
        sx={
          isElectricMode
            ? {
                backgroundColor: theme.custom.electric.glow,
                color: theme.custom.electric.glowText,
                boxShadow: `0 0 4px ${theme.custom.electric.glow}`,
                borderRadius: "2px",
                padding: "0 2px",
              }
            : {}
        }
      >
        <TextWrapper>{children}</TextWrapper>
      </Box>
    ),
    b: ({ children }) => (
      <Box
        component="strong"
        sx={
          isElectricMode
            ? {
                backgroundColor: theme.custom.electric.glow,
                color: theme.custom.electric.glowText,
                boxShadow: `0 0 4px ${theme.custom.electric.glow}`,
                borderRadius: "2px",
                padding: "0 2px",
              }
            : {}
        }
      >
        <TextWrapper>{children}</TextWrapper>
      </Box>
    ),
  };

  return (
    <Paper
      ref={containerRef}
      elevation={0}
      sx={{
        p: 4,
        minHeight: "100vh",
        borderRadius: isFullscreen ? 0 : 4,
        transition: "all 0.3s ease",
        position: "relative",
        maxWidth: "100%",
        mx: "auto",
        overflow: isFullscreen ? "auto" : undefined,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1,
          display: "flex",
          gap: 1,
        }}
      >
        <Tooltip
          title={isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}
        >
          <IconButton
            onClick={toggleEditMode}
            color={isEditMode ? "primary" : "default"}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            isElectricMode ? "Disable Electric Mode" : "Enable Electric Mode"
          }
        >
          <IconButton
            onClick={toggleElectricMode}
            color={isElectricMode ? "warning" : "default"}
          >
            <ElectricBoltIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
          <IconButton onClick={toggleFullscreen}>
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <GlobalStyles styles={syntaxHighlightStyles} />
      {blocks.map((block) => {
        if (block.type === 'empty') return null;

        if (isEditMode && editingBlockId === block.id) {
          return (
            <ClickAwayListener key={block.id} onClickAway={() => handleSaveBlock(block)}>
              <Box sx={{ my: 1 }}>
                <InputBase
                  multiline
                  fullWidth
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveBlock(block);
                    }
                  }}
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    p: 2,
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                />
              </Box>
            </ClickAwayListener>
          );
        }

        return (
          <Box
            key={block.id}
            onClick={() => {
              if (isEditMode) {
                setEditingBlockId(block.id);
                setEditValue(block.rawContent);
              }
            }}
            sx={{
              ...(isEditMode && {
                cursor: 'pointer',
                borderRadius: 1,
                border: '1px solid transparent',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  borderStyle: 'dashed',
                  backgroundColor: theme.palette.action.hover,
                }
              })
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeSlug]}
              components={components}
            >
              {block.rawContent}
            </ReactMarkdown>
          </Box>
        );
      })}
    </Paper>
  );
};

export default MarkdownReader;
