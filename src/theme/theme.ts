import { createTheme, type ThemeOptions } from '@mui/material/styles';

const baseThemeOptions: ThemeOptions = {
    typography: {
        fontFamily: [
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
        },
    },
    shape: {
        borderRadius: 16, // rounded corners for M3 feel
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20, // Pill shape for buttons
                    textTransform: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove default gradient in dark mode
                },
                rounded: {
                    borderRadius: 28, // Large rounded corners for surfaces
                },
            },
        },
    },
};

export const lightTheme = createTheme({
    ...baseThemeOptions,
    palette: {
        mode: 'light',
        primary: {
            main: '#6750A4', // M3 Seed Purple
            light: '#EADDFF',
            dark: '#21005D',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#625B71',
            light: '#E8DEF8',
            dark: '#1D192B',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#FFFBFE',
            paper: '#F7F2FA', // Surface 1
        },
        text: {
            primary: '#1C1B1F',
            secondary: '#49454F',
        },
    },
});

export const darkTheme = createTheme({
    ...baseThemeOptions,
    palette: {
        mode: 'dark',
        primary: {
            main: '#D0BCFF', // M3 Purple 80
            light: '#EADDFF',
            dark: '#4F378B', // Primary 30
            contrastText: '#381E72', // Primary 20
        },
        secondary: {
            main: '#CCC2DC',
            light: '#E8DEF8',
            dark: '#4A4458',
            contrastText: '#332D41',
        },
        background: {
            default: '#1C1B1F', // Neutral 10
            paper: '#2B2930', // Surface 1
        },
        text: {
            primary: '#E6E1E5',
            secondary: '#CAC4D0',
        },
    },
});
