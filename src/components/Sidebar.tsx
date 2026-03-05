import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Collapse,
  IconButton,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { useFile } from "../store/FileContext";

const drawerWidth = 280;

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { files, selectFile, currentFile } = useFile();
  const [openWorkspace, setOpenWorkspace] = useState(true);
  const [openImported, setOpenImported] = useState(true);

  const workspaceFiles = files.filter((f) => !f.isImported);
  const importedFiles = files.filter((f) => f.isImported);

  const handleFileClick = (name: string) => {
    selectFile(name);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "none",
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <Box sx={{ overflow: "auto", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
          >
            Markdown Reader
          </Typography>
          {isMobile && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        <List>
          {/* Workspace Section */}
          <ListItemButton onClick={() => setOpenWorkspace(!openWorkspace)}>
            <ListItemText
              primary="Workspace"
              primaryTypographyProps={{
                fontWeight: "medium",
                color: theme.palette.text.secondary,
              }}
            />
            {openWorkspace ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openWorkspace} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {workspaceFiles.length === 0 ? (
                <ListItem>
                  <ListItemText secondary="No files found" sx={{ pl: 4 }} />
                </ListItem>
              ) : (
                workspaceFiles.map((file) => (
                  <ListItemButton
                    key={file.name}
                    sx={{
                      pl: 4,
                      borderRadius: 4,
                      mb: 0.5,
                      backgroundColor:
                        currentFile?.name === file.name
                          ? theme.palette.action.selected
                          : "transparent",
                    }}
                    onClick={() => handleFileClick(file.name)}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <InsertDriveFileIcon
                        fontSize="small"
                        color={
                          currentFile?.name === file.name
                            ? "primary"
                            : "inherit"
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      primaryTypographyProps={{
                        noWrap: true,
                        fontSize: "0.9rem",
                      }}
                    />
                  </ListItemButton>
                ))
              )}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {/* Imported Section */}
          <ListItemButton onClick={() => setOpenImported(!openImported)}>
            <ListItemText
              primary="Imported"
              primaryTypographyProps={{
                fontWeight: "medium",
                color: theme.palette.text.secondary,
              }}
            />
            {openImported ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openImported} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {importedFiles.map((file) => (
                <ListItemButton
                  key={file.name}
                  sx={{
                    pl: 4,
                    borderRadius: 4,
                    mb: 0.5,
                    backgroundColor:
                      currentFile?.name === file.name
                        ? theme.palette.action.selected
                        : "transparent",
                  }}
                  onClick={() => handleFileClick(file.name)}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <DescriptionIcon
                      fontSize="small"
                      color={
                        currentFile?.name === file.name
                          ? "secondary"
                          : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontSize: "0.9rem",
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
