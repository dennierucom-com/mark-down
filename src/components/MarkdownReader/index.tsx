import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  IconButton,
  Paper,
  GlobalStyles,
  useTheme,
} from "@mui/material";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useSearch } from "../../context/SearchContext";
import { useFile } from "../../context/FileContext";
import { useDialog } from "../../context/DialogContext";
import { groupMarkdownLines, type MarkdownBlock } from "../../utils/markdownLineGrouper";

import { useMarkdownComponents, syntaxHighlightStyles } from "./MarkdownComponents";
import { AddSectionPopover } from "./AddSectionPopover";
import { ReaderToolbar } from "./ReaderToolbar";
import { MarkdownViewerBlock } from "./MarkdownViewerBlock";
import { useFullscreen } from "../../hooks/useFullscreen";

interface MarkdownReaderProps {
  content: string;
  fileName?: string;
  onContentChange?: (newContent: string) => void;
}

const MarkdownReader: React.FC<MarkdownReaderProps> = ({ content, fileName, onContentChange }) => {
  const theme = useTheme();
  const { isDirty, markClean, selectFile, files } = useFile();
  const { requestSaveWithDiscard } = useDialog();
  const { isFullscreen } = useFullscreen();
  const [isElectricMode, setIsElectricMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  // Holds the current live value of the active inline editor so we can commit it before fullscreen
  const activeEditValueRef = useRef<string | null>(null);
  const activeEditBlockRef = useRef<MarkdownBlock | null>(null);
  // When true, enter fullscreen as soon as isDirty becomes false
  const [pendingFullscreenEnter, setPendingFullscreenEnter] = useState(false);
  
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number>(-1);
  const [deleteConfirmBlockId, setDeleteConfirmBlockId] = useState<string | null>(null);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  const { searchTerm, setTotalMatches, currentMatchIndex } = useSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  const blocks = React.useMemo(() => groupMarkdownLines(content), [content]);

  const handleNavigate = useCallback((targetName: string, anchor?: string) => {
    // Try to find the file in the workspace
    const found = files.find(f => 
      f.name === targetName || 
      f.path === targetName ||
      f.name === targetName + '.md'
    );
    if (found) {
      selectFile(found.name);
      if (anchor) {
        // Scroll to anchor after a short delay to let the content render
        setTimeout(() => {
          const el = document.getElementById(anchor);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [files, selectFile]);

  const components = useMarkdownComponents(isElectricMode, handleNavigate);

  /** Commit any open inline editor block and disable edit mode. */
  const exitEditMode = useCallback((commitBlock?: { block: MarkdownBlock; value: string }) => {
    if (commitBlock && commitBlock.value !== commitBlock.block.rawContent && onContentChange) {
      const lines = content.split('\n');
      lines.splice(
        commitBlock.block.startLine,
        commitBlock.block.endLine - commitBlock.block.startLine + 1,
        ...commitBlock.value.split('\n')
      );
      onContentChange(lines.join('\n'));
    }
    setIsEditMode(false);
    setEditingBlockId(null);
    setDeleteConfirmBlockId(null);
    activeEditValueRef.current = null;
    activeEditBlockRef.current = null;
  }, [content, onContentChange]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      // Exiting fullscreen — just exit, no guard needed.
      document.exitFullscreen();
      return;
    }

    // Entering fullscreen:
    // Step 1 — if a block editor is open, commit its current value first.
    const commitBlock =
      activeEditBlockRef.current && activeEditValueRef.current !== null
        ? { block: activeEditBlockRef.current, value: activeEditValueRef.current }
        : undefined;

    // Step 2 — disable edit mode (may mark file dirty if commitBlock has changes).
    exitEditMode(commitBlock);

    // Step 3 — if file is dirty (either pre-existing or just made dirty by the commit above),
    // ask the user to save first, then enter fullscreen once isDirty becomes false.
    // We read isDirty here *before* the commit state update settles, so we also check
    // whether a commit with actual changes is pending.
    const willBeDirty = isDirty || (commitBlock && commitBlock.value !== commitBlock.block.rawContent);
    if (willBeDirty) {
      // Show UnsavedChangesDialog with Save / Discard / Cancel options.
      // onDiscard: mark file clean → pendingFullscreenEnter resolves automatically.
      // onCancel: abort the fullscreen entry.
      requestSaveWithDiscard(
        markClean,
        () => setPendingFullscreenEnter(false)
      );
      setPendingFullscreenEnter(true);
    } else {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
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

  // removed local fullscreen listener, now handled by useFullscreen

  // Enter fullscreen once isDirty is cleared (user saved or discarded)
  useEffect(() => {
    if (pendingFullscreenEnter && !isDirty) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingFullscreenEnter(false);
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  }, [pendingFullscreenEnter, isDirty]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setIsEditMode(false);
    setEditingBlockId(null);
    setDeleteConfirmBlockId(null);
    setPendingFullscreenEnter(false);
    /* eslint-enable react-hooks/set-state-in-effect */
    activeEditValueRef.current = null;
    activeEditBlockRef.current = null;
  }, [fileName]);

  useEffect(() => {
    if (isEditMode && editingBlockId) {
      const activeBlock = blocks.find(b => b.id === editingBlockId);
      if (activeBlock) {
        activeEditBlockRef.current = activeBlock;
        if (activeEditValueRef.current === null) {
          activeEditValueRef.current = activeBlock.rawContent;
        }
      }
    }
  }, [isEditMode, editingBlockId, blocks]);

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
      <ReaderToolbar
        isFullscreen={isFullscreen}
        isEditMode={isEditMode}
        isElectricMode={isElectricMode}
        toggleFullscreen={toggleFullscreen}
        toggleEditMode={toggleEditMode}
        toggleElectricMode={toggleElectricMode}
      />

      <GlobalStyles styles={syntaxHighlightStyles} />
      {blocks.map((block, index) => {
        if (block.type === 'empty') return null;

        return (
          <MarkdownViewerBlock
            key={block.id}
            block={block}
            index={index}
            prevBlockEndLine={index === 0 ? -1 : blocks[index - 1].endLine}
            isEditMode={isEditMode}
            isEditing={isEditMode && editingBlockId === block.id}
            isConfirmingDelete={deleteConfirmBlockId === block.id}
            components={components}
            theme={theme}
            onEditClick={setEditingBlockId}
            onAddClick={handleAddClick}
            onDeleteConfirmClick={setDeleteConfirmBlockId}
            onDeleteCancel={() => setDeleteConfirmBlockId(null)}
            onDeleteExecute={handleDeleteBlock}
            onSave={(b, newContent) => {
              activeEditValueRef.current = null;
              activeEditBlockRef.current = null;
              handleSaveBlock(b, newContent);
            }}
            onCancelEdit={() => {
              activeEditValueRef.current = null;
              activeEditBlockRef.current = null;
              setEditingBlockId(null);
            }}
            onValueChange={(v) => { activeEditValueRef.current = v; }}
          />
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
