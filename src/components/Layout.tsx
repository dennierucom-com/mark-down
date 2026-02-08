import React from 'react';
import { Box, CssBaseline, Toolbar, useTheme, AppBar, Typography, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Sidebar from './Sidebar';
import { useFile } from '../context/FileContext';
import { useColorMode } from '../context/ThemeContext';

interface LayoutProps {
    children: React.ReactNode;
}

const drawerWidth = 280;

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const theme = useTheme();
    // We can enhance mobile support later with a temporary drawer state
    // For now, let's assume Sidebar handles its variant based on prop or context
    // Actually, to keep it simple, Sidebar is fixed on desktop. Mobile needs a toggle.

    // Refactoring Sidebar usage slightly for Mobile.
    // But for this step, let's focus on the structure.

    const { currentFile } = useFile();
    const { mode, toggleTheme } = useColorMode();

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* App Bar mainly for Mobile or Global Actions */}
            <AppBar position="fixed" sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                boxShadow: 'none',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {currentFile ? currentFile.name : 'Select a file'}
                    </Typography>
                    <Tooltip title="Toggle light/dark theme">
                        <IconButton onClick={toggleTheme} color="inherit">
                            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Sidebar />
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: theme.palette.background.paper,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Toolbar /> {/* Spacer for AppBar */}
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
