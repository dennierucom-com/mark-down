import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkWikiLink from '../../utils/remarkWikiLink';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { Theme } from '@mui/material/styles';
import type { MarkdownBlock } from '../../utils/markdownLineGrouper';
import { MarkdownEditorBlock } from './MarkdownEditorBlock';

interface MarkdownViewerBlockProps {
  block: MarkdownBlock;
  index: number;
  prevBlockEndLine: number;
  isEditMode: boolean;
  isEditing: boolean;
  isConfirmingDelete: boolean;
  components: Record<string, unknown>;
  theme: Theme;
  onEditClick: (id: string) => void;
  onAddClick: (e: React.MouseEvent<HTMLButtonElement>, lineIndex: number) => void;
  onDeleteConfirmClick: (id: string) => void;
  onDeleteCancel: () => void;
  onDeleteExecute: (block: MarkdownBlock) => void;
  onSave: (block: MarkdownBlock, content: string) => void;
  onCancelEdit: () => void;
  onValueChange: (v: string) => void;
}

export const MarkdownViewerBlock: React.FC<MarkdownViewerBlockProps> = React.memo(({
  block,
  index,
  prevBlockEndLine,
  isEditMode,
  isEditing,
  isConfirmingDelete,
  components,
  theme,
  onEditClick,
  onAddClick,
  onDeleteConfirmClick,
  onDeleteCancel,
  onDeleteExecute,
  onSave,
  onCancelEdit,
  onValueChange
}) => {
  const addSectionButton = isEditMode && (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1, opacity: 0.3, '&:hover': { opacity: 1 }, transition: 'opacity 0.2s' }}>
      <IconButton 
        size="small" 
        onClick={(e) => onAddClick(e, index === 0 ? -1 : prevBlockEndLine)} 
        sx={{ border: `1px solid ${theme.palette.divider}` }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  if (isEditing) {
    return (
      <React.Fragment>
        {addSectionButton}
        <MarkdownEditorBlock
          initialValue={block.rawContent}
          onSave={(newContent) => onSave(block, newContent)}
          onCancel={onCancelEdit}
          onValueChange={onValueChange}
        />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {addSectionButton}
      <Box
        onClick={() => {
          if (isEditMode) {
            onEditClick(block.id);
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
              onDeleteConfirmClick(block.id);
            }}
          >
            {isConfirmingDelete ? (
              <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
                <Typography variant="caption" sx={{ px: 1, fontWeight: 'bold', color: 'error.main' }}>Delete?</Typography>
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDeleteExecute(block); }}>
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDeleteCancel(); }}>
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
          remarkPlugins={[remarkGfm, remarkWikiLink]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={components}
        >
          {block.rawContent}
        </ReactMarkdown>
      </Box>
    </React.Fragment>
  );
}, (prevProps, nextProps) => {
  // Custom equality check for React.memo to optimize re-renders
  // NOTE: components must be included — it carries isElectricMode and searchTerm state
  return (
    prevProps.block.rawContent === nextProps.block.rawContent &&
    prevProps.isEditMode === nextProps.isEditMode &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.isConfirmingDelete === nextProps.isConfirmingDelete &&
    prevProps.prevBlockEndLine === nextProps.prevBlockEndLine &&
    prevProps.components === nextProps.components
  );
});

MarkdownViewerBlock.displayName = 'MarkdownViewerBlock';
