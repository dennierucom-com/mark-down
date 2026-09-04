import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, Tooltip, IconButton, useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import type { Components } from 'react-markdown';
import { useSearch } from '../../context/SearchContext';

export const useMarkdownComponents = (isElectricMode: boolean, onNavigate?: (fileName: string, anchor?: string) => void) => {
  const theme = useTheme();
  const { searchTerm } = useSearch();

  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Helper to highlight text
  const HighlightText = ({ text }: { text: string }) => {
    if (!searchTerm || !text) return <>{text}</>;
    const escaped = escapeRegExp(searchTerm);
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
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
          )
        )}
      </>
    );
  };

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
    h1: ({ children, ...props }) => (
      <Typography variant="h1" gutterBottom id={props.id}>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h2: ({ children, ...props }) => (
      <Typography variant="h2" gutterBottom id={props.id}>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h3: ({ children, ...props }) => (
      <Typography variant="h3" gutterBottom id={props.id}>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h4: ({ children, ...props }) => (
      <Typography variant="h4" gutterBottom id={props.id}>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h5: ({ children, ...props }) => (
      <Typography variant="h5" gutterBottom id={props.id}>
        <TextWrapper>{children}</TextWrapper>
      </Typography>
    ),
    h6: ({ children, ...props }) => (
      <Typography variant="h6" gutterBottom id={props.id}>
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
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
      const isAnchor = href?.startsWith('#');

      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </a>
        );
      }

      if (isAnchor) {
        return <a href={href} {...props}>{children}</a>;
      }

      // Internal link — navigate between files
      const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onNavigate && href) {
          const hashIndex = href.indexOf('#');
          if (hashIndex > -1) {
            onNavigate(href.substring(0, hashIndex), href.substring(hashIndex + 1));
          } else {
            onNavigate(href);
          }
        }
      };

      return (
        <a
          href={href}
          onClick={handleClick}
          style={{ cursor: 'pointer', color: theme.palette.primary.main, textDecoration: 'underline' }}
          {...props}
        >
          {children}
        </a>
      );
    },
  };

  return components;
};

export const syntaxHighlightStyles = {
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
