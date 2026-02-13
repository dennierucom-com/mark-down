import { createContext, useContext } from 'react';

export interface ThemeContextType {
    mode: 'light' | 'dark';
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useColorMode = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useColorMode must be used within a ThemeContextProvider');
    }
    return context;
};
