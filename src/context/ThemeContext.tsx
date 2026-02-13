import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useMediaQuery } from '@mui/material';

interface ThemeContextType {
    mode: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('theme_mode');
        return (saved === 'light' || saved === 'dark') ? saved : (prefersDarkMode ? 'dark' : 'light');
    });

    useEffect(() => {
        localStorage.setItem('theme_mode', mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useColorMode = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useColorMode must be used within a ThemeContextProvider');
    }
    return context;
};
