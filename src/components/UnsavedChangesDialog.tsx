import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useFile } from '../context/FileContext';

interface UnsavedChangesDialogProps {
  open: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({ open, onSave, onDiscard, onCancel }) => {
  const theme = useTheme();
  const { currentFile } = useFile();

  if (!currentFile) return null;

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.warning.main }}>
          <WarningAmberIcon color="warning" /> Unsaved Changes
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          You have unsaved changes in "{currentFile.name}".
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Do you want to save your changes before proceeding?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 2 }}>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={onDiscard} color="error">
          Discard
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsavedChangesDialog;
