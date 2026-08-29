import React, { useState, useEffect } from 'react';
import { Box, InputBase, ClickAwayListener, Typography, useTheme } from '@mui/material';

interface MarkdownEditorBlockProps {
  initialValue: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
  onValueChange?: (value: string) => void;
}

export const MarkdownEditorBlock: React.FC<MarkdownEditorBlockProps> = ({ initialValue, onSave, onCancel, onValueChange }) => {
  const theme = useTheme();
  const [editValue, setEditValue] = useState(initialValue);

  useEffect(() => {
    setEditValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    onSave(editValue);
  };

  const handleClickAway = () => {
    if (editValue !== initialValue) {
      onSave(editValue);
    } else {
      onCancel();
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ my: 1 }}>
        <InputBase
          multiline
          fullWidth
          autoFocus
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            onValueChange?.(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              e.preventDefault();
              const target = e.target as HTMLTextAreaElement;
              const start = target.selectionStart;
              const end = target.selectionEnd;
              const newValue = editValue.substring(0, start) + '\n' + editValue.substring(end);
              setEditValue(newValue);
              onValueChange?.(newValue);
              requestAnimationFrame(() => {
                if (target) {
                  target.selectionStart = target.selectionEnd = start + 1;
                }
              });
            } else if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
            if (e.key === 'Escape') {
              onCancel();
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
  );
};
