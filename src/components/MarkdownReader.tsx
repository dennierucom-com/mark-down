import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Box, IconButton, Paper, Typography, useTheme, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import 'highlight.js/styles/github-dark.css'; // Or dynamically switch based on theme
import type { Components } from 'react-markdown';
import { useSearch } from '../context/SearchContext';

interface MarkdownReaderProps {
    content: string;
}

const MarkdownReader: React.FC<MarkdownReaderProps> = ({ content }) => {
    const theme = useTheme();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { searchTerm, setTotalMatches, currentMatchIndex } = useSearch();
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    // Effect to count matches and handle navigation
    useEffect(() => {
        if (!containerRef.current) return;

        // Give React time to render the marks
        const timeout = setTimeout(() => {
            const matches = containerRef.current?.querySelectorAll('mark');
            if (matches) {
                setTotalMatches(matches.length);

                // Apply active class and scroll
                matches.forEach((match, index) => {
                    if (index === currentMatchIndex) {
                        match.style.backgroundColor = '#ff9800'; // Orange for active
                        match.style.color = 'black';
                        match.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        match.style.backgroundColor = '#ffeb3b'; // Yellow for others
                        match.style.color = 'black';
                    }
                });
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [content, searchTerm, currentMatchIndex, setTotalMatches]);


    // Helper to highlight text
    const HighlightText = ({ text }: { text: string }) => {
        if (!searchTerm || !text) return <>{text}</>;

        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <mark key={i} style={{ backgroundColor: '#ffeb3b', color: 'black', borderRadius: 2 }}>{part}</mark>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    // Wrapper for text-containing elements
    const TextWrapper = ({ children }: { children: React.ReactNode }) => {
        return (
            <>
                {React.Children.map(children, child => {
                    if (typeof child === 'string') {
                        return <HighlightText text={child} />;
                    }
                    return child;
                })}
            </>
        );
    };

    // Custom renderer for code blocks to add copy functionality
    const components: Components = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            const handleCopy = () => {
                navigator.clipboard.writeText(codeString);
            };

            return !inline ? (
                <Box sx={{ position: 'relative', mb: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 0,
                            overflow: 'hidden',
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa' // GitHub style bg
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 1,
                                backgroundColor: theme.palette.mode === 'dark' ? '#161b22' : '#eaeef2',
                                borderBottom: `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', ml: 1 }}>
                                {match ? match[1] : 'text'}
                            </Typography>
                            <Tooltip title="Copy to Clipboard">
                                <IconButton size="small" onClick={handleCopy}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ p: 2, overflowX: 'auto' }}>
                            <code className={className} {...props}>
                                {children}
                            </code>
                        </Box>
                    </Paper>
                </Box>
            ) : (
                <code className={className} {...props} style={{
                    backgroundColor: theme.palette.action.hover,
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontFamily: 'monospace'
                }}>
                    {children}
                </code>
            );
        },
        p: ({ children }) => <Typography paragraph component="div"><TextWrapper>{children}</TextWrapper></Typography>,
        h1: ({ children }) => <Typography variant="h1" gutterBottom><TextWrapper>{children}</TextWrapper></Typography>,
        h2: ({ children }) => <Typography variant="h2" gutterBottom><TextWrapper>{children}</TextWrapper></Typography>,
        h3: ({ children }) => <Typography variant="h3" gutterBottom><TextWrapper>{children}</TextWrapper></Typography>,
        h4: ({ children }) => <Typography variant="h4" gutterBottom><TextWrapper>{children}</TextWrapper></Typography>,
        h5: ({ children }) => <Typography variant="h5" gutterBottom><TextWrapper>{children}</TextWrapper></Typography>,
        h6: ({ children }) => <Typography variant="h6" gutterBottom><TextWrapper>{children}</TextWrapper></Typography>,
        li: ({ children }) => <li><Typography component="span"><TextWrapper>{children}</TextWrapper></Typography></li>,
    };

    return (
        <Paper
            ref={containerRef}
            elevation={0}
            sx={{
                p: 4,
                minHeight: '100vh',
                borderRadius: isFullscreen ? 0 : 4,
                transition: 'all 0.3s ease',
                position: 'relative',
                maxWidth: '100%',
                mx: 'auto'
                // Center content container?
            }}
        >
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                <IconButton
                    onClick={toggleFullscreen}
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                >
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
            </Tooltip>

            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </Paper>
    );
};

export default MarkdownReader;
