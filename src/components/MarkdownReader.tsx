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
import SubjectIcon from "@mui/icons-material/Subject";
import TitleIcon from "@mui/icons-material/Title";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import TableChartIcon from "@mui/icons-material/TableChart";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { InputBase, ClickAwayListener, Popover, List, ListItem, ListItemIcon, ListItemText, Snackbar, Button, ListItemButton } from "@mui/material";
import { groupMarkdownLines, type MarkdownBlock } from "../utils/markdownLineGrouper";

// ... (existing helper functions)

const MarkdownReader: React.FC<MarkdownReaderProps> = ({ content, onContentChange }) => {
  const theme = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isElectricMode, setIsElectricMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number>(-1);
  const [deleteConfirmBlockId, setDeleteConfirmBlockId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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

  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>, lineIndex: number) => {
    event.stopPropagation();
    setPopoverAnchorEl(event.currentTarget);
    setInsertionIndex(lineIndex);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleInsertTemplate = (templateContent: string) => {
    handlePopoverClose();
    if (onContentChange) {
      const lines = content.split('\n');
      const insertAt = insertionIndex;
      if (insertAt === -1) {
          lines.unshift(...templateContent.split('\n'));
      } else {
          lines.splice(insertAt + 1, 0, ...templateContent.split('\n'));
      }
      onContentChange(lines.join('\n'));
      const newBlockId = `block-${insertAt === -1 ? 0 : insertAt + 1}`;
      // Use setTimeout so the new block ID is set after the render cycle where the content updates
      setTimeout(() => {
        setEditingBlockId(newBlockId);
        setEditValue(templateContent);
      }, 50);
    }
  };

  const handleDeleteBlock = (block: MarkdownBlock) => {
    if (onContentChange) {
      const lines = content.split('\n');
      lines.splice(block.startLine, block.endLine - block.startLine + 1);
      onContentChange(lines.join('\n'));
      setSnackbarMessage("Section deleted");
      setSnackbarOpen(true);
    }
    setDeleteConfirmBlockId(null);
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
      {blocks.map((block, index) => {
        if (block.type === 'empty') return null;

        const addSectionButton = isEditMode && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 1, opacity: 0.3, '&:hover': { opacity: 1 }, transition: 'opacity 0.2s' }}>
            <IconButton size="small" onClick={(e) => handleAddClick(e, index === 0 ? -1 : blocks[index - 1].endLine)} sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        );

        if (isEditMode && editingBlockId === block.id) {
          return (
            <React.Fragment key={block.id}>
              {addSectionButton}
              <ClickAwayListener onClickAway={() => handleSaveBlock(block)}>
                <Box sx={{ my: 1 }}>
                  <InputBase
                    multiline
                    fullWidth
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        const target = e.target as HTMLTextAreaElement;
                        const start = target.selectionStart;
                        const end = target.selectionEnd;
                        const newValue = editValue.substring(0, start) + '\n' + editValue.substring(end);
                        setEditValue(newValue);
                        requestAnimationFrame(() => {
                          if (target) {
                            target.selectionStart = target.selectionEnd = start + 1;
                          }
                        });
                      } else if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveBlock(block);
                      }
                      if (e.key === "Escape") {
                        setEditingBlockId(null);
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
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, textAlign: 'right' }}>
                    Enter to save · Ctrl+Enter for new line · Esc to cancel
                  </Typography>
                </Box>
              </ClickAwayListener>
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={block.id}>
            {addSectionButton}
            <Box
              onClick={() => {
                if (isEditMode) {
                  setEditingBlockId(block.id);
                  setEditValue(block.rawContent);
                }
              }}
              sx={{
                position: 'relative',
                ...(isEditMode && {
                  cursor: 'pointer',
                  borderRadius: 1,
                  border: '1px solid transparent',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    borderStyle: 'dashed',
                    backgroundColor: theme.palette.action.hover,
                  },
                  '&:hover .delete-btn': {
                    display: 'flex'
                  }
                })
              }}
            >
              {isEditMode && (
                <Box
                  className="delete-btn"
                  sx={{
                    display: 'none',
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 1,
                    boxShadow: 1
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmBlockId(block.id);
                  }}
                >
                  {deleteConfirmBlockId === block.id ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
                      <Typography variant="caption" sx={{ px: 1, fontWeight: 'bold', color: 'error.main' }}>Delete?</Typography>
                      <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block); }}>
                        <CheckIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); setDeleteConfirmBlockId(null); }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Tooltip title="Delete block">
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeSlug]}
                components={components}
              >
                {block.rawContent}
              </ReactMarkdown>
            </Box>
          </React.Fragment>
        );
      })}
      
      {isEditMode && blocks.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, opacity: 0.3, '&:hover': { opacity: 1 }, transition: 'opacity 0.2s' }}>
          <IconButton onClick={(e) => handleAddClick(e, blocks[blocks.length - 1].endLine)} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <AddIcon />
          </IconButton>
        </Box>
      )}

      {isEditMode && blocks.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button startIcon={<AddIcon />} variant="outlined" onClick={(e) => handleAddClick(e, -1)}>
            Add First Section
          </Button>
        </Box>
      )}

      <Popover
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List dense sx={{ width: 200 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleInsertTemplate('\n\n')}>
              <ListItemIcon sx={{ minWidth: 36 }}><SubjectIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Paragraph" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleInsertTemplate('## New Heading\n')}>
              <ListItemIcon sx={{ minWidth: 36 }}><TitleIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Heading" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleInsertTemplate('```\n\n```')}>
              <ListItemIcon sx={{ minWidth: 36 }}><CodeIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Code Block" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleInsertTemplate('- Item 1\n- Item 2\n- Item 3\n')}>
              <ListItemIcon sx={{ minWidth: 36 }}><FormatListBulletedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Bullet List" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleInsertTemplate('1. Item 1\n2. Item 2\n3. Item 3\n')}>
              <ListItemIcon sx={{ minWidth: 36 }}><FormatListNumberedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Numbered List" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleInsertTemplate('| Column 1 | Column 2 |\n| -------- | -------- |\n| Text     | Text     |\n')}>
              <ListItemIcon sx={{ minWidth: 36 }}><TableChartIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Table" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleInsertTemplate('> Quote text\n')}>
              <ListItemIcon sx={{ minWidth: 36 }}><FormatQuoteIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Blockquote" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleInsertTemplate('---\n')}>
              <ListItemIcon sx={{ minWidth: 36 }}><HorizontalRuleIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Divider" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Paper>
  );
};

export default MarkdownReader;
