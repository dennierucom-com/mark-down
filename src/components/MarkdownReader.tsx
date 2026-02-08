import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Box, IconButton, Paper, Typography, useTheme, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import 'highlight.js/styles/github-dark.css'; // Or dynamically switch based on theme
import type { Components } from 'react-markdown';

interface MarkdownReaderProps {
    content: string;
}

const MarkdownReader: React.FC<MarkdownReaderProps> = ({ content }) => {
    const theme = useTheme();
    const [isFullscreen, setIsFullscreen] = useState(false);

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

    // Custom renderer for code blocks to add copy functionality
    const components: Components = {
        code({ node, inline, className, children, ...props }: any) {
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
        }
    };

    return (
        <Paper
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
