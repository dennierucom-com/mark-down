import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  useTheme,
  AppBar,
  Typography,
  IconButton,
  Tooltip,
  InputBase,
  Paper,
  Divider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Snackbar,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SaveIcon from "@mui/icons-material/Save";
import CircleIcon from "@mui/icons-material/Circle";
import AddIcon from "@mui/icons-material/Add";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Sidebar from "./Sidebar";
import { useFile } from "../context/FileContext";
import { useColorMode } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";
import { useFileActions } from "../hooks/useFileActions";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import SaveDialog from "./SaveDialog";
import UnsavedChangesDialog from "./UnsavedChangesDialog";

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const {
    currentFile, isDirty,
    pendingAction, confirmPendingAction, cancelPendingAction,
    saveDialogRequested, clearSaveRequest,
    saveWithDiscardRequested, executeSaveWithDiscardDiscard, executeSaveWithDiscardCancel, clearSaveWithDiscardRequest,
  } = useFile();
  const { mode, toggleTheme } = useColorMode();
  const {
    searchTerm,
    setSearchTerm,
    nextMatch,
    prevMatch,
    totalMatches,
    currentMatchIndex,
  } = useSearch();
  const { handleOpenFolder, handleManualInject, clearFiles } = useFileActions();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Open SaveDialog whenever MarkdownReader (or any context consumer) requests a save
  useEffect(() => {
    if (saveDialogRequested) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaveDialogOpen(true);
      clearSaveRequest();
    }
  }, [saveDialogRequested, clearSaveRequest]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (isDirty) {
          setSaveDialogOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDirty]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchToggle = () => {
    if (showSearch) {
      setSearchTerm(""); // Clear search on close
    }
    setShowSearch(!showSearch);
  };

  const speedDialActions = [
    {
      icon: <FolderOpenIcon />,
      name: "Open Folder",
      onClick: handleOpenFolder,
    },
    { icon: <AddIcon />, name: "Add File", onClick: handleManualInject },
    { icon: <DeleteSweepIcon />, name: "Clear Workspace", onClick: clearFiles },
    { icon: <SaveIcon />, name: "Save", onClick: () => setSaveDialogOpen(true) },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: "none",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {!showSearch ? (
            <>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {currentFile ? currentFile.name : "Select a file"}
                {isDirty && (
                  <CircleIcon sx={{ fontSize: 10, color: theme.palette.warning.main }} />
                )}
              </Typography>
              <Tooltip title="Save (Ctrl+S)">
                <span>
                  <IconButton 
                    onClick={() => setSaveDialogOpen(true)} 
                    color="inherit"
                    disabled={!isDirty}
                  >
                    <SaveIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Find in page">
                <IconButton onClick={handleSearchToggle} color="inherit">
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 500,
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: "none",
              }}
              elevation={0}
              onSubmit={(e) => e.preventDefault()}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Find..."
                inputProps={{ "aria-label": "search google maps" }}
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Typography
                variant="caption"
                sx={{ mx: 1, minWidth: 40, textAlign: "center" }}
              >
                {totalMatches > 0
                  ? `${currentMatchIndex + 1}/${totalMatches}`
                  : "0/0"}
              </Typography>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton
                sx={{ p: "10px" }}
                aria-label="previous"
                onClick={prevMatch}
                disabled={totalMatches === 0}
              >
                <ExpandLessIcon />
              </IconButton>
              <IconButton
                sx={{ p: "10px" }}
                aria-label="next"
                onClick={nextMatch}
                disabled={totalMatches === 0}
              >
                <ExpandMoreIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton
                sx={{ p: "10px" }}
                aria-label="close"
                onClick={handleSearchToggle}
              >
                <CloseIcon />
              </IconButton>
            </Paper>
          )}

          <Box sx={{ flexGrow: showSearch ? 0 : 0 }}>
            {" "}
            {/* Spacer if needed or just keep align right */}
            <Tooltip title="Toggle light/dark theme">
              <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.paper,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        {children}
      </Box>
      <PWAInstallPrompt />

      {/* Global SpeedDial - hidden during fullscreen */}
      {!isFullscreen && (
        <SpeedDial
          ariaLabel="File actions"
          sx={{ position: "fixed", bottom: 32, right: 32 }}
          icon={<SpeedDialIcon />}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      )}

      <SaveDialog 
        open={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)} 
        onSuccess={(msg) => {
          setSnackbarMessage(msg);
          setSnackbarOpen(true);
          if (pendingAction) {
            confirmPendingAction();
          }
        }}
      />
      <UnsavedChangesDialog
        open={!!pendingAction}
        onSave={() => setSaveDialogOpen(true)}
        onDiscard={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
      {/* Separate dialog for the fullscreen guard — includes a Discard option */}
      <UnsavedChangesDialog
        open={saveWithDiscardRequested}
        onSave={() => {
          clearSaveWithDiscardRequest();
          setSaveDialogOpen(true);
        }}
        onDiscard={executeSaveWithDiscardDiscard}
        onCancel={executeSaveWithDiscardCancel}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;
