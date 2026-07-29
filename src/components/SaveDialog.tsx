import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  useTheme,
  Tooltip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useFile } from '../context/FileContext';

interface SaveDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const SaveDialog: React.FC<SaveDialogProps> = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const { currentFile, saveToHandle, saveAsNewFile, downloadFile } = useFile();

  const handleSaveOriginal = async () => {
    const success = await saveToHandle();
    if (success) {
      onSuccess('Saved to original file.');
      onClose();
    }
  };

  const handleSaveAsNew = async () => {
    const success = await saveAsNewFile();
    if (success) {
      onSuccess('Saved as new file.');
      onClose();
    }
  };

  const handleDownload = () => {
    downloadFile();
    onSuccess('File downloaded.');
    onClose();
  };

  const hasHandle = !!currentFile?.handle;
  // File System Access API is not available on Firefox/Safari.
  const hasFSAPI = 'showSaveFilePicker' in window;

  if (!currentFile) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SaveIcon color="primary" /> Save Changes
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          "{currentFile.name}" has unsaved changes. How would you like to save?
        </Typography>

        <List sx={{ pt: 2 }}>
          {hasFSAPI && (
            <Tooltip
              title={!hasHandle ? "File was imported. No original file to overwrite." : ""}
              placement="left"
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={handleSaveOriginal}
                  disabled={!hasHandle}
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <ListItemIcon>
                    <SaveIcon color={hasHandle ? "primary" : "disabled"} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Overwrite Original"
                    secondary="Save back to the original file"
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          )}

          {hasFSAPI && (
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={handleSaveAsNew}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <ListItemIcon>
                  <NoteAddIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Save As New File"
                  secondary="Choose a new location and filename"
                />
              </ListItemButton>
            </ListItem>
          )}

          {!hasFSAPI && (
            <Box sx={{ mb: 2, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Your browser does not support saving directly to the file system. Please use the Download option.
              </Typography>
            </Box>
          )}

          <ListItem disablePadding>
            <ListItemButton
              onClick={handleDownload}
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <ListItemIcon>
                <DownloadIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Download"
                secondary="Download as a .md file"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDialog;
