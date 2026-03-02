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
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import "highlight.js/styles/github-dark.css"; // Or dynamically switch based on theme
import type { Components } from "react-markdown";
import { useSearch } from "../context/SearchContext";

interface MarkdownReaderProps {
  content: string;
}

import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

// ... (existing helper functions)

const MarkdownReader: React.FC<MarkdownReaderProps> = ({ content }) => {
  const theme = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isElectricMode, setIsElectricMode] = useState(false);
  const { searchTerm, setTotalMatches, currentMatchIndex } = useSearch();
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [content, searchTerm, currentMatchIndex, setTotalMatches]);

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

  // Block code renderer — wraps fenced code blocks (```...```)
  // In react-markdown, block code is always rendered as <pre><code>...</code></pre>.
  // By overriding `pre`, we capture the block wrapper and add our custom UI.
  const PreBlock = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLPreElement>) => {
    const codeRef = useRef<HTMLPreElement>(null);

    const handleCopy = () => {
      if (codeRef.current) {
        navigator.clipboard.writeText(codeRef.current.innerText);
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
      <Box sx={{ position: "relative", mb: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 0,
            overflow: "hidden",
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.custom.codeBlock.background,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              backgroundColor: theme.custom.codeBlock.headerBackground,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontFamily: "monospace", ml: 1 }}
            >
              {language}
            </Typography>
            <Tooltip title="Copy to Clipboard">
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ p: 2, overflowX: "auto" }}>
            <pre ref={codeRef} {...props} style={{ margin: 0 }}>
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

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </Paper>
  );
};

export default MarkdownReader;
