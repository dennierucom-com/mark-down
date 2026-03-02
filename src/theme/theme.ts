import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { type AppPalette } from './palette';

// ─── Extend MUI Theme with custom tokens ──────────────────────────

declare module '@mui/material/styles' {
    interface Theme {
        custom: {
            codeBlock: AppPalette['codeBlock'];
            search: AppPalette['search'];
            electric: AppPalette['electric'];
        };
    }
    interface ThemeOptions {
        custom?: {
            codeBlock?: AppPalette['codeBlock'];
            search?: AppPalette['search'];
            electric?: AppPalette['electric'];
        };
    }
}

// ─── Base (shared) theme options ──────────────────────────────────

const baseThemeOptions: ThemeOptions = {
    typography: {
        fontFamily: [
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: { fontSize: '2.5rem', fontWeight: 500 },
        h2: { fontSize: '2rem', fontWeight: 500 },
        body1: { fontSize: '1rem' },
    },
    shape: { borderRadius: 16 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 20, textTransform: 'none' },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none' },
                rounded: { borderRadius: 28 },
            },
        },
    },
};

// ─── Build theme from any palette ─────────────────────────────────

export const buildTheme = (palette: AppPalette, mode: 'light' | 'dark') =>
    createTheme({
        ...baseThemeOptions,
        palette: {
            mode,
            primary: palette.primary,
            secondary: palette.secondary,
            background: palette.background,
            text: palette.text,
        },
        custom: {
            codeBlock: palette.codeBlock,
            search: palette.search,
            electric: palette.electric,
        },
    });
