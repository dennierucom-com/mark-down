import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { useFile } from "../context/FileContext";
import { useDialog } from "../context/DialogContext";
import { useColorMode } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import SaveDialog from "./SaveDialog";
import UnsavedChangesDialog from "./UnsavedChangesDialog";
import { ActionSpeedDial } from "./ActionSpeedDial";
import { TopAppBar } from "./TopAppBar";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useFullscreen } from "../hooks/useFullscreen";

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  
  // File Context
  const { currentFile, isDirty } = useFile();
  
  // Dialog Context
  const {
    pendingAction,
    confirmPendingAction,
    cancelPendingAction,
    saveDialogRequested,
    requestSaveDialog,
    clearSaveDialogRequest,
    saveWithDiscardRequested,
    executeSaveWithDiscardDiscard,
    executeSaveWithDiscardCancel,
    clearSaveWithDiscardRequest,
  } = useDialog();

  // Search Context
  const {
    searchTerm,
    setSearchTerm,
    nextMatch,
    prevMatch,
    totalMatches,
    currentMatchIndex,
  } = useSearch();

  // Theme Context
  const { mode, toggleTheme } = useColorMode();

  // Local State
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Custom Hooks
  const { isFullscreen } = useFullscreen();

  useKeyboardShortcuts([
    {
      key: 's',
      ctrlOrMetaKey: true,
      handler: () => {
        if (isDirty) {
          requestSaveDialog();
        }
      }
    }
  ]);

  // Handlers
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleSearchToggle = () => {
    if (showSearch) setSearchTerm("");
    setShowSearch(!showSearch);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      <TopAppBar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        showSearch={showSearch}
        handleSearchToggle={handleSearchToggle}
        theme={theme}
        currentFile={currentFile}
        isDirty={isDirty}
        requestSaveDialog={requestSaveDialog}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalMatches={totalMatches}
        currentMatchIndex={currentMatchIndex}
        prevMatch={prevMatch}
        nextMatch={nextMatch}
        toggleTheme={toggleTheme}
        mode={mode}
      />

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
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

      {!isFullscreen && <ActionSpeedDial />}

      <SaveDialog 
        open={saveDialogRequested} 
        onClose={clearSaveDialogRequest} 
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
        onSave={() => requestSaveDialog()}
        onDiscard={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
      <UnsavedChangesDialog
        open={saveWithDiscardRequested}
        onSave={() => {
          clearSaveWithDiscardRequest();
          requestSaveDialog();
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
