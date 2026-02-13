import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, useTheme, AppBar, Typography, IconButton, Tooltip, InputBase, Paper, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from './Sidebar';
import { useFile } from '../context/FileContext';
import { useColorMode } from '../context/ThemeContext';
import { useSearch } from '../context/SearchContext';
import { PWAInstallPrompt } from './PWAInstallPrompt';

interface LayoutProps {
    children: React.ReactNode;
}

const drawerWidth = 280;

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const theme = useTheme();
    const { currentFile } = useFile();
    const { mode, toggleTheme } = useColorMode();
    const { searchTerm, setSearchTerm, nextMatch, prevMatch, totalMatches, currentMatchIndex } = useSearch();
    const [showSearch, setShowSearch] = useState(false);

    const handleSearchToggle = () => {
        if (showSearch) {
            setSearchTerm(''); // Clear search on close
        }
        setShowSearch(!showSearch);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
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

                    {!showSearch ? (
                        <>
                            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                                {currentFile ? currentFile.name : 'Select a file'}
                            </Typography>
                            <Tooltip title="Find in page">
                                <IconButton onClick={handleSearchToggle} color="inherit">
                                    <SearchIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    ) : (
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: 500, border: `1px solid ${theme.palette.primary.main}`, boxShadow: 'none' }}
                            elevation={0}
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Find..."
                                inputProps={{ 'aria-label': 'search google maps' }}
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Typography variant="caption" sx={{ mx: 1, minWidth: 40, textAlign: 'center' }}>
                                {totalMatches > 0 ? `${currentMatchIndex + 1}/${totalMatches}` : '0/0'}
                            </Typography>
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton sx={{ p: '10px' }} aria-label="previous" onClick={prevMatch} disabled={totalMatches === 0}>
                                <ExpandLessIcon />
                            </IconButton>
                            <IconButton sx={{ p: '10px' }} aria-label="next" onClick={nextMatch} disabled={totalMatches === 0}>
                                <ExpandMoreIcon />
                            </IconButton>
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton sx={{ p: '10px' }} aria-label="close" onClick={handleSearchToggle}>
                                <CloseIcon />
                            </IconButton>
                        </Paper>
                    )}

                    <Box sx={{ flexGrow: showSearch ? 0 : 0 }}> {/* Spacer if needed or just keep align right */}
                        <Tooltip title="Toggle light/dark theme">
                            <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
                                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
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
            <PWAInstallPrompt />
        </Box>
    );
};

export default Layout;
