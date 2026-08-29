import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  InputBase,
  Paper,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CircleIcon from "@mui/icons-material/Circle";
import type { Theme } from "@mui/material/styles";
import type { MarkdownFile } from "../context/FileContext";

interface TopAppBarProps {
  drawerWidth: number;
  handleDrawerToggle: () => void;
  showSearch: boolean;
  handleSearchToggle: () => void;
  theme: Theme;
  currentFile: MarkdownFile | null;
  isDirty: boolean;
  requestSaveDialog: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalMatches: number;
  currentMatchIndex: number;
  prevMatch: () => void;
  nextMatch: () => void;
  toggleTheme: () => void;
  mode: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  drawerWidth,
  handleDrawerToggle,
  showSearch,
  handleSearchToggle,
  theme,
  currentFile,
  isDirty,
  requestSaveDialog,
  searchTerm,
  setSearchTerm,
  totalMatches,
  currentMatchIndex,
  prevMatch,
  nextMatch,
  toggleTheme,
  mode,
}) => {
  return (
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
                  onClick={requestSaveDialog} 
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
          <Tooltip title="Toggle light/dark theme">
            <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
