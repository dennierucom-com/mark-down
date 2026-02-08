import React, { useState } from 'react';
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
    Fab,
    useTheme,
    useMediaQuery,
    Collapse,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useFile, type MarkdownFile } from '../context/FileContext';

const drawerWidth = 280;

const Sidebar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { files, selectFile, currentFile, addFile, setWorkspaceFiles } = useFile();
    const [openWorkspace, setOpenWorkspace] = useState(true);
    const [openImported, setOpenImported] = useState(true);

    const handleOpenWorkspace = () => {
        setOpenWorkspace(!openWorkspace);
    };

    const handleOpenImported = () => {
        setOpenImported(!openImported);
    };

    const handleOpenFolder = async () => {
        try {
            // @ts-ignore - File System Access API
            const dirHandle = await window.showDirectoryPicker();
            const newFiles: MarkdownFile[] = [];

            // Recursive function to scan directory? Or just flat for now?
            // Let's do flat for simplicity first, or basic recursion if easy.
            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file' && entry.name.endsWith('.md')) {
                    const file = await entry.getFile();
                    const text = await file.text();
                    newFiles.push({
                        name: entry.name,
                        path: entry.name, // Relative path or just name
                        content: text,
                        handle: entry
                    });
                }
            }
            setWorkspaceFiles(newFiles);
        } catch (err) {
            console.error("Error accessing folder:", err);
        }
    };

    const handleManualInject = async () => {
        // Manual file upload via hidden input or similar, 
        // OR standard file picker if FS Access not used for single file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.markdown';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const text = await file.text();
                addFile({
                    name: file.name,
                    content: text,
                    isImported: true
                });
            }
        };
        input.click();
    };

    const workspaceFiles = files.filter(f => !f.isImported);
    const importedFiles = files.filter(f => f.isImported);

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none', backgroundColor: theme.palette.background.default },
            }}
            open={true} // Handle mobile open state if needed
        >
            <Box sx={{ overflow: 'auto', p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                    Markdown Reader
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Fab
                        variant="extended"
                        color="primary"
                        aria-label="open folder"
                        onClick={handleOpenFolder}
                        sx={{ width: '100%', mb: 1, boxShadow: 'none' }}
                    >
                        <FolderOpenIcon sx={{ mr: 1 }} />
                        Open Folder
                    </Fab>
                </Box>

                <Divider sx={{ my: 1 }} />

                <List>
                    {/* Workspace Section */}
                    <ListItemButton onClick={handleOpenWorkspace}>
                        <ListItemText primary="Workspace" primaryTypographyProps={{ fontWeight: 'medium', color: theme.palette.text.secondary }} />
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
                                        sx={{ pl: 4, borderRadius: 4, mb: 0.5, backgroundColor: currentFile?.name === file.name ? theme.palette.action.selected : 'transparent' }}
                                        onClick={() => selectFile(file.name)}
                                    >
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <InsertDriveFileIcon fontSize="small" color={currentFile?.name === file.name ? 'primary' : 'inherit'} />
                                        </ListItemIcon>
                                        <ListItemText primary={file.name} primaryTypographyProps={{ noWrap: true, fontSize: 0.9 }} />
                                    </ListItemButton>
                                ))
                            )}
                        </List>
                    </Collapse>

                    <Divider sx={{ my: 1 }} />

                    {/* Imported Section */}
                    <ListItemButton onClick={handleOpenImported}>
                        <ListItemText primary="Imported" primaryTypographyProps={{ fontWeight: 'medium', color: theme.palette.text.secondary }} />
                        {openImported ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openImported} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {importedFiles.map((file) => (
                                <ListItemButton
                                    key={file.name}
                                    sx={{ pl: 4, borderRadius: 4, mb: 0.5, backgroundColor: currentFile?.name === file.name ? theme.palette.action.selected : 'transparent' }}
                                    onClick={() => selectFile(file.name)}
                                >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <DescriptionIcon fontSize="small" color={currentFile?.name === file.name ? 'secondary' : 'inherit'} />
                                    </ListItemIcon>
                                    <ListItemText primary={file.name} primaryTypographyProps={{ noWrap: true, fontSize: 0.9 }} />
                                </ListItemButton>
                            ))}
                            <ListItemButton onClick={handleManualInject} sx={{ pl: 4, color: theme.palette.primary.main }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <AddIcon fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Add File" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
