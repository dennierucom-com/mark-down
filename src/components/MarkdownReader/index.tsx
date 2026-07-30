import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  GlobalStyles,
  useTheme,
  Typography
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { useSearch } from "../../context/SearchContext";
import { groupMarkdownLines, type MarkdownBlock } from "../../utils/markdownLineGrouper";

import { useMarkdownComponents, syntaxHighlightStyles } from "./MarkdownComponents";
import { MarkdownEditorBlock } from "./MarkdownEditorBlock";
import { AddSectionPopover } from "./AddSectionPopover";

interface MarkdownReaderProps {
  content: string;
  onContentChange?: (newContent: string) => void;
}

const MarkdownReader: React.FC<MarkdownReaderProps> = ({ content, onContentChange }) => {
  const theme = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isElectricMode, setIsElectricMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number>(-1);
  const [deleteConfirmBlockId, setDeleteConfirmBlockId] = useState<string | null>(null);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  const { searchTerm, setTotalMatches, currentMatchIndex } = useSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  const blocks = React.useMemo(() => groupMarkdownLines(content), [content]);
  const components = useMarkdownComponents(isElectricMode);

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

  const handleSaveBlock = (block: MarkdownBlock, newContent: string) => {
    if (newContent !== block.rawContent && onContentChange) {
      const lines = content.split('\n');
      lines.splice(block.startLine, block.endLine - block.startLine + 1, ...newContent.split('\n'));
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
      setTimeout(() => {
        setEditingBlockId(newBlockId);
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const timeout = setTimeout(() => {
      const matches = containerRef.current?.querySelectorAll("mark");
      if (matches) {
        setTotalMatches(matches.length);
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
        <Tooltip title={isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}>
          <IconButton onClick={toggleEditMode} color={isEditMode ? "primary" : "default"}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={isElectricMode ? "Disable Electric Mode" : "Enable Electric Mode"}>
          <IconButton onClick={toggleElectricMode} color={isElectricMode ? "warning" : "default"}>
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
              <MarkdownEditorBlock
                initialValue={block.rawContent}
                onSave={(newContent) => handleSaveBlock(block, newContent)}
                onCancel={() => setEditingBlockId(null)}
              />
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

      <AddSectionPopover 
        anchorEl={popoverAnchorEl} 
        onClose={handlePopoverClose} 
        onInsert={handleInsertTemplate} 
      />

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
