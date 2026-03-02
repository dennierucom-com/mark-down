/**
 * Centralized Color Palette
 *
 * Change the entire app's color scheme by editing the values below.
 * Each palette defines colors for both MUI theme integration and
 * custom component tokens (code blocks, search highlights, etc.).
 *
 * The app rotates palettes randomly every 7 days.
 */

// ─── Palette Interface ────────────────────────────────────────────

export interface AppPalette {
    // MUI standard palette colors
    primary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
    };
    secondary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
    };
    background: {
        default: string;
        paper: string;
    };
    text: {
        primary: string;
        secondary: string;
    };

    // Custom tokens — code blocks
    codeBlock: {
        background: string;
        headerBackground: string;
    };

    // Custom tokens — search & highlights
    search: {
        activeHighlight: string;
        highlight: string;
        highlightText: string;
    };

    // Custom tokens — electric mode
    electric: {
        glow: string;
        glowText: string;
    };
}

export interface PaletteEntry {
    name: string;
    light: AppPalette;
    dark: AppPalette;
}

// ─── 1. Purple (M3 Seed) ──────────────────────────────────────────

const purpleLight: AppPalette = {
    primary: { main: '#6750A4', light: '#EADDFF', dark: '#21005D', contrastText: '#FFFFFF' },
    secondary: { main: '#625B71', light: '#E8DEF8', dark: '#1D192B', contrastText: '#FFFFFF' },
    background: { default: '#FFFBFE', paper: '#F7F2FA' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f6f8fa', headerBackground: '#eaeef2' },
    search: { activeHighlight: '#ff9800', highlight: '#ffeb3b', highlightText: '#000000' },
    electric: { glow: '#ffeb3b', glowText: '#000000' },
};

const purpleDark: AppPalette = {
    primary: { main: '#D0BCFF', light: '#EADDFF', dark: '#4F378B', contrastText: '#381E72' },
    secondary: { main: '#CCC2DC', light: '#E8DEF8', dark: '#4A4458', contrastText: '#332D41' },
    background: { default: '#1C1B1F', paper: '#2B2930' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#ffeb3b', highlightText: '#000000' },
    electric: { glow: '#ffeb3b', glowText: '#000000' },
};

// ─── 2. Blue (#2196f3) ────────────────────────────────────────────

const blueLight: AppPalette = {
    primary: { main: '#2196F3', light: '#BBDEFB', dark: '#0D47A1', contrastText: '#FFFFFF' },
    secondary: { main: '#546E7A', light: '#B0BEC5', dark: '#263238', contrastText: '#FFFFFF' },
    background: { default: '#FAFCFF', paper: '#F0F6FF' },
    text: { primary: '#1A1C1E', secondary: '#44474E' },
    codeBlock: { background: '#f6f8fa', headerBackground: '#e3edf7' },
    search: { activeHighlight: '#ff9800', highlight: '#BBDEFB', highlightText: '#000000' },
    electric: { glow: '#64B5F6', glowText: '#000000' },
};

const blueDark: AppPalette = {
    primary: { main: '#90CAF9', light: '#BBDEFB', dark: '#1565C0', contrastText: '#0A3055' },
    secondary: { main: '#90A4AE', light: '#B0BEC5', dark: '#37474F', contrastText: '#1C2D35' },
    background: { default: '#1A1C1E', paper: '#272A2F' },
    text: { primary: '#E2E2E6', secondary: '#C4C6CF' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#1565C0', highlightText: '#FFFFFF' },
    electric: { glow: '#64B5F6', glowText: '#000000' },
};

// ─── 3. Green (#4caf50) ───────────────────────────────────────────

const greenLight: AppPalette = {
    primary: { main: '#4CAF50', light: '#C8E6C9', dark: '#1B5E20', contrastText: '#FFFFFF' },
    secondary: { main: '#6D7B5A', light: '#D5E4C0', dark: '#3A4A2A', contrastText: '#FFFFFF' },
    background: { default: '#FCFDF7', paper: '#F2F7ED' },
    text: { primary: '#1A1C18', secondary: '#44483E' },
    codeBlock: { background: '#f6f8f4', headerBackground: '#e5ede0' },
    search: { activeHighlight: '#ff9800', highlight: '#C8E6C9', highlightText: '#000000' },
    electric: { glow: '#81C784', glowText: '#000000' },
};

const greenDark: AppPalette = {
    primary: { main: '#A5D6A7', light: '#C8E6C9', dark: '#2E7D32', contrastText: '#0A3A0E' },
    secondary: { main: '#A4B591', light: '#D5E4C0', dark: '#4A5A3A', contrastText: '#2A3A1A' },
    background: { default: '#1A1C18', paper: '#272B22' },
    text: { primary: '#E2E3DB', secondary: '#C5C8BC' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#2E7D32', highlightText: '#FFFFFF' },
    electric: { glow: '#81C784', glowText: '#000000' },
};

// ─── 4. Blue Grey (#607d8b) ───────────────────────────────────────

const blueGreyLight: AppPalette = {
    primary: { main: '#607D8B', light: '#CFD8DC', dark: '#37474F', contrastText: '#FFFFFF' },
    secondary: { main: '#78909C', light: '#B0BEC5', dark: '#455A64', contrastText: '#FFFFFF' },
    background: { default: '#FAFBFC', paper: '#ECEEF0' },
    text: { primary: '#1C1F21', secondary: '#44484B' },
    codeBlock: { background: '#f3f5f7', headerBackground: '#e0e4e8' },
    search: { activeHighlight: '#ff9800', highlight: '#CFD8DC', highlightText: '#000000' },
    electric: { glow: '#90A4AE', glowText: '#000000' },
};

const blueGreyDark: AppPalette = {
    primary: { main: '#B0BEC5', light: '#CFD8DC', dark: '#546E7A', contrastText: '#1C2F38' },
    secondary: { main: '#90A4AE', light: '#B0BEC5', dark: '#37474F', contrastText: '#1A2A32' },
    background: { default: '#1C1F21', paper: '#292D30' },
    text: { primary: '#E1E3E4', secondary: '#C3C7CA' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#455A64', highlightText: '#FFFFFF' },
    electric: { glow: '#90A4AE', glowText: '#000000' },
};

// ─── 5. Red (#f44336) ─────────────────────────────────────────────

const redLight: AppPalette = {
    primary: { main: '#F44336', light: '#FFCDD2', dark: '#B71C1C', contrastText: '#FFFFFF' },
    secondary: { main: '#7B5A5A', light: '#E4C0C0', dark: '#4A2A2A', contrastText: '#FFFFFF' },
    background: { default: '#FFFBFA', paper: '#FFF0EE' },
    text: { primary: '#201A19', secondary: '#534341' },
    codeBlock: { background: '#f8f6f5', headerBackground: '#f0e6e4' },
    search: { activeHighlight: '#ff9800', highlight: '#FFCDD2', highlightText: '#000000' },
    electric: { glow: '#EF9A9A', glowText: '#000000' },
};

const redDark: AppPalette = {
    primary: { main: '#EF9A9A', light: '#FFCDD2', dark: '#C62828', contrastText: '#440E0E' },
    secondary: { main: '#B59191', light: '#E4C0C0', dark: '#5A3A3A', contrastText: '#3A1A1A' },
    background: { default: '#201A19', paper: '#2E2524' },
    text: { primary: '#EDE0DE', secondary: '#D8C2BF' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#C62828', highlightText: '#FFFFFF' },
    electric: { glow: '#EF9A9A', glowText: '#000000' },
};

// ─── All Palettes ─────────────────────────────────────────────────

export const palettes: PaletteEntry[] = [
    { name: 'purple', light: purpleLight, dark: purpleDark },
    { name: 'blue', light: blueLight, dark: blueDark },
    { name: 'green', light: greenLight, dark: greenDark },
    { name: 'blue-grey', light: blueGreyLight, dark: blueGreyDark },
    { name: 'red', light: redLight, dark: redDark },
];

export const getPaletteByName = (name: string): PaletteEntry =>
    palettes.find(p => p.name === name) ?? palettes[0];

export const getRandomPalette = (): PaletteEntry =>
    palettes[Math.floor(Math.random() * palettes.length)];
