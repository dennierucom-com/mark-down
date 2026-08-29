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
    electric: { glow: '#BBDEFB', glowText: '#000000' },
};

const blueDark: AppPalette = {
    primary: { main: '#90CAF9', light: '#BBDEFB', dark: '#1565C0', contrastText: '#0A3055' },
    secondary: { main: '#90A4AE', light: '#B0BEC5', dark: '#37474F', contrastText: '#1C2D35' },
    background: { default: '#1A1C1E', paper: '#272A2F' },
    text: { primary: '#E2E2E6', secondary: '#C4C6CF' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#1565C0', highlightText: '#FFFFFF' },
    electric: { glow: '#1565C0', glowText: '#000000' },
};

// ─── 3. Green (#4caf50) ───────────────────────────────────────────

const greenLight: AppPalette = {
    primary: { main: '#4CAF50', light: '#C8E6C9', dark: '#1B5E20', contrastText: '#FFFFFF' },
    secondary: { main: '#6D7B5A', light: '#D5E4C0', dark: '#3A4A2A', contrastText: '#FFFFFF' },
    background: { default: '#FCFDF7', paper: '#F2F7ED' },
    text: { primary: '#1A1C18', secondary: '#44483E' },
    codeBlock: { background: '#f6f8f4', headerBackground: '#e5ede0' },
    search: { activeHighlight: '#ff9800', highlight: '#C8E6C9', highlightText: '#000000' },
    electric: { glow: '#C8E6C9', glowText: '#000000' },
};

const greenDark: AppPalette = {
    primary: { main: '#A5D6A7', light: '#C8E6C9', dark: '#2E7D32', contrastText: '#0A3A0E' },
    secondary: { main: '#A4B591', light: '#D5E4C0', dark: '#4A5A3A', contrastText: '#2A3A1A' },
    background: { default: '#1A1C18', paper: '#272B22' },
    text: { primary: '#E2E3DB', secondary: '#C5C8BC' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#2E7D32', highlightText: '#FFFFFF' },
    electric: { glow: '#2E7D32', glowText: '#000000' },
};

// ─── 4. Blue Grey (#607d8b) ───────────────────────────────────────

const blueGreyLight: AppPalette = {
    primary: { main: '#607D8B', light: '#CFD8DC', dark: '#37474F', contrastText: '#FFFFFF' },
    secondary: { main: '#78909C', light: '#B0BEC5', dark: '#455A64', contrastText: '#FFFFFF' },
    background: { default: '#FAFBFC', paper: '#ECEEF0' },
    text: { primary: '#1C1F21', secondary: '#44484B' },
    codeBlock: { background: '#f3f5f7', headerBackground: '#e0e4e8' },
    search: { activeHighlight: '#ff9800', highlight: '#CFD8DC', highlightText: '#000000' },
    electric: { glow: '#CFD8DC', glowText: '#000000' },
};

const blueGreyDark: AppPalette = {
    primary: { main: '#B0BEC5', light: '#CFD8DC', dark: '#546E7A', contrastText: '#1C2F38' },
    secondary: { main: '#90A4AE', light: '#B0BEC5', dark: '#37474F', contrastText: '#1A2A32' },
    background: { default: '#1C1F21', paper: '#292D30' },
    text: { primary: '#E1E3E4', secondary: '#C3C7CA' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#455A64', highlightText: '#FFFFFF' },
    electric: { glow: '#455A64', glowText: '#000000' },
};

// ─── 5. Red (#f44336) ─────────────────────────────────────────────

const redLight: AppPalette = {
    primary: { main: '#F44336', light: '#FFCDD2', dark: '#B71C1C', contrastText: '#FFFFFF' },
    secondary: { main: '#7B5A5A', light: '#E4C0C0', dark: '#4A2A2A', contrastText: '#FFFFFF' },
    background: { default: '#FFFBFA', paper: '#FFF0EE' },
    text: { primary: '#201A19', secondary: '#534341' },
    codeBlock: { background: '#f8f6f5', headerBackground: '#f0e6e4' },
    search: { activeHighlight: '#ff9800', highlight: '#FFCDD2', highlightText: '#000000' },
    electric: { glow: '#FFCDD2', glowText: '#000000' },
};

const redDark: AppPalette = {
    primary: { main: '#EF9A9A', light: '#FFCDD2', dark: '#C62828', contrastText: '#440E0E' },
    secondary: { main: '#B59191', light: '#E4C0C0', dark: '#5A3A3A', contrastText: '#3A1A1A' },
    background: { default: '#201A19', paper: '#2E2524' },
    text: { primary: '#EDE0DE', secondary: '#D8C2BF' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#C62828', highlightText: '#FFFFFF' },
    electric: { glow: '#C62828', glowText: '#000000' },
};

// ─── 6. Pink (#E91E63) ────────────────────────────────────────────
const pinkLight: AppPalette = {
    primary: { main: '#E91E63', light: '#F8BBD0', dark: '#880E4F', contrastText: '#FFFFFF' },
    secondary: { main: '#C2185B', light: '#F48FB1', dark: '#880E4F', contrastText: '#FFFFFF' },
    background: { default: '#FFFBFA', paper: '#FFF0F2' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f8f5f6', headerBackground: '#f2eef0' },
    search: { activeHighlight: '#ff9800', highlight: '#F8BBD0', highlightText: '#000000' },
    electric: { glow: '#F8BBD0', glowText: '#000000' },
};

const pinkDark: AppPalette = {
    primary: { main: '#F48FB1', light: '#F8BBD0', dark: '#C2185B', contrastText: '#4E0023' },
    secondary: { main: '#F06292', light: '#F8BBD0', dark: '#AD1457', contrastText: '#5C0028' },
    background: { default: '#1C1B1F', paper: '#2D2829' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#C2185B', highlightText: '#FFFFFF' },
    electric: { glow: '#C2185B', glowText: '#000000' },
};

// ─── 7. Material Purple (#9C27B0) ─────────────────────────────────
const materialPurpleLight: AppPalette = {
    primary: { main: '#9C27B0', light: '#E1BEE7', dark: '#4A148C', contrastText: '#FFFFFF' },
    secondary: { main: '#7B1FA2', light: '#CE93D8', dark: '#4A148C', contrastText: '#FFFFFF' },
    background: { default: '#FFFBFE', paper: '#F8F4FA' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f7f5f8', headerBackground: '#efecef' },
    search: { activeHighlight: '#ff9800', highlight: '#E1BEE7', highlightText: '#000000' },
    electric: { glow: '#E1BEE7', glowText: '#000000' },
};

const materialPurpleDark: AppPalette = {
    primary: { main: '#CE93D8', light: '#E1BEE7', dark: '#7B1FA2', contrastText: '#38004D' },
    secondary: { main: '#BA68C8', light: '#E1BEE7', dark: '#6A1B9A', contrastText: '#480062' },
    background: { default: '#1C1B1F', paper: '#2A272C' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#7B1FA2', highlightText: '#FFFFFF' },
    electric: { glow: '#7B1FA2', glowText: '#000000' },
};

// ─── 8. Deep Purple (#673AB7) ─────────────────────────────────────
const deepPurpleLight: AppPalette = {
    primary: { main: '#673AB7', light: '#D1C4E9', dark: '#311B92', contrastText: '#FFFFFF' },
    secondary: { main: '#512DA8', light: '#B39DDB', dark: '#311B92', contrastText: '#FFFFFF' },
    background: { default: '#FFFBFE', paper: '#F5F4F8' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f5f4f8', headerBackground: '#efedf3' },
    search: { activeHighlight: '#ff9800', highlight: '#D1C4E9', highlightText: '#000000' },
    electric: { glow: '#D1C4E9', glowText: '#000000' },
};

const deepPurpleDark: AppPalette = {
    primary: { main: '#B39DDB', light: '#D1C4E9', dark: '#512DA8', contrastText: '#1F005C' },
    secondary: { main: '#9575CD', light: '#D1C4E9', dark: '#4527A0', contrastText: '#2D0070' },
    background: { default: '#1C1B1F', paper: '#27262A' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#512DA8', highlightText: '#FFFFFF' },
    electric: { glow: '#512DA8', glowText: '#000000' },
};

// ─── 9. Indigo (#3F51B5) ──────────────────────────────────────────
const indigoLight: AppPalette = {
    primary: { main: '#3F51B5', light: '#C5CAE9', dark: '#1A237E', contrastText: '#FFFFFF' },
    secondary: { main: '#303F9F', light: '#9FA8DA', dark: '#1A237E', contrastText: '#FFFFFF' },
    background: { default: '#FAFCFF', paper: '#F2F4F9' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f4f5f8', headerBackground: '#ecedf3' },
    search: { activeHighlight: '#ff9800', highlight: '#C5CAE9', highlightText: '#000000' },
    electric: { glow: '#C5CAE9', glowText: '#000000' },
};

const indigoDark: AppPalette = {
    primary: { main: '#9FA8DA', light: '#C5CAE9', dark: '#303F9F', contrastText: '#000F5D' },
    secondary: { main: '#7986CB', light: '#C5CAE9', dark: '#283593', contrastText: '#081775' },
    background: { default: '#1A1C1E', paper: '#25262B' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#303F9F', highlightText: '#FFFFFF' },
    electric: { glow: '#303F9F', glowText: '#000000' },
};

// ─── 10. Light Blue (#03A9F4) ─────────────────────────────────────
const lightBlueLight: AppPalette = {
    primary: { main: '#03A9F4', light: '#B3E5FC', dark: '#01579B', contrastText: '#000000' },
    secondary: { main: '#0288D1', light: '#81D4FA', dark: '#01579B', contrastText: '#FFFFFF' },
    background: { default: '#FAFCFF', paper: '#F1F8FB' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f3f8fa', headerBackground: '#e5eff4' },
    search: { activeHighlight: '#ff9800', highlight: '#B3E5FC', highlightText: '#000000' },
    electric: { glow: '#B3E5FC', glowText: '#000000' },
};

const lightBlueDark: AppPalette = {
    primary: { main: '#81D4FA', light: '#B3E5FC', dark: '#0288D1', contrastText: '#00344F' },
    secondary: { main: '#4FC3F7', light: '#B3E5FC', dark: '#0277BD', contrastText: '#00476A' },
    background: { default: '#1A1C1E', paper: '#242729' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#0288D1', highlightText: '#FFFFFF' },
    electric: { glow: '#0288D1', glowText: '#000000' },
};

// ─── 11. Cyan (#00BCD4) ───────────────────────────────────────────
const cyanLight: AppPalette = {
    primary: { main: '#00BCD4', light: '#B2EBF2', dark: '#006064', contrastText: '#000000' },
    secondary: { main: '#0097A7', light: '#80DEEA', dark: '#006064', contrastText: '#FFFFFF' },
    background: { default: '#FAFDFF', paper: '#F0F9FA' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f2f9f9', headerBackground: '#e4f1f2' },
    search: { activeHighlight: '#ff9800', highlight: '#B2EBF2', highlightText: '#000000' },
    electric: { glow: '#B2EBF2', glowText: '#000000' },
};

const cyanDark: AppPalette = {
    primary: { main: '#80DEEA', light: '#B2EBF2', dark: '#0097A7', contrastText: '#00363D' },
    secondary: { main: '#4DD0E1', light: '#B2EBF2', dark: '#00838F', contrastText: '#004953' },
    background: { default: '#1A1C1E', paper: '#232728' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#0097A7', highlightText: '#FFFFFF' },
    electric: { glow: '#0097A7', glowText: '#000000' },
};

// ─── 12. Teal (#009688) ───────────────────────────────────────────
const tealLight: AppPalette = {
    primary: { main: '#009688', light: '#B2DFDB', dark: '#004D40', contrastText: '#FFFFFF' },
    secondary: { main: '#00796B', light: '#80CBC4', dark: '#004D40', contrastText: '#FFFFFF' },
    background: { default: '#FAFDFA', paper: '#F1F9F8' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f2f8f7', headerBackground: '#e3f1ef' },
    search: { activeHighlight: '#ff9800', highlight: '#B2DFDB', highlightText: '#000000' },
    electric: { glow: '#B2DFDB', glowText: '#000000' },
};

const tealDark: AppPalette = {
    primary: { main: '#80CBC4', light: '#B2DFDB', dark: '#00796B', contrastText: '#003831' },
    secondary: { main: '#4DB6AC', light: '#B2DFDB', dark: '#00695C', contrastText: '#004C43' },
    background: { default: '#1A1C1C', paper: '#232827' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#00796B', highlightText: '#FFFFFF' },
    electric: { glow: '#00796B', glowText: '#000000' },
};

// ─── 13. Light Green (#8BC34A) ────────────────────────────────────
const lightGreenLight: AppPalette = {
    primary: { main: '#8BC34A', light: '#DCEDC8', dark: '#33691E', contrastText: '#000000' },
    secondary: { main: '#689F38', light: '#C5E1A5', dark: '#33691E', contrastText: '#FFFFFF' },
    background: { default: '#FCFDFB', paper: '#F5F9F1' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f6f9f3', headerBackground: '#ebf2e5' },
    search: { activeHighlight: '#ff9800', highlight: '#DCEDC8', highlightText: '#000000' },
    electric: { glow: '#DCEDC8', glowText: '#000000' },
};

const lightGreenDark: AppPalette = {
    primary: { main: '#C5E1A5', light: '#DCEDC8', dark: '#689F38', contrastText: '#1E3C00' },
    secondary: { main: '#AED581', light: '#DCEDC8', dark: '#558B2F', contrastText: '#2B5400' },
    background: { default: '#1A1C1B', paper: '#262924' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#689F38', highlightText: '#FFFFFF' },
    electric: { glow: '#689F38', glowText: '#000000' },
};

// ─── 14. Lime (#CDDC39) ───────────────────────────────────────────
const limeLight: AppPalette = {
    primary: { main: '#CDDC39', light: '#F0F4C3', dark: '#827717', contrastText: '#000000' },
    secondary: { main: '#AFB42B', light: '#E6EE9C', dark: '#827717', contrastText: '#FFFFFF' },
    background: { default: '#FDFDFC', paper: '#F8F9F3' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f9faf5', headerBackground: '#eff2e3' },
    search: { activeHighlight: '#ff9800', highlight: '#F0F4C3', highlightText: '#000000' },
    electric: { glow: '#F0F4C3', glowText: '#000000' },
};

const limeDark: AppPalette = {
    primary: { main: '#E6EE9C', light: '#F0F4C3', dark: '#AFB42B', contrastText: '#323600' },
    secondary: { main: '#DCE775', light: '#F0F4C3', dark: '#9E9D24', contrastText: '#474B00' },
    background: { default: '#1A1C1A', paper: '#272922' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#AFB42B', highlightText: '#FFFFFF' },
    electric: { glow: '#AFB42B', glowText: '#000000' },
};

// ─── 15. Yellow (#FFEB3B) ─────────────────────────────────────────
const yellowLight: AppPalette = {
    primary: { main: '#FFEB3B', light: '#FFF9C4', dark: '#F57F17', contrastText: '#000000' },
    secondary: { main: '#FBC02D', light: '#FFF59D', dark: '#F57F17', contrastText: '#000000' },
    background: { default: '#FEFDFB', paper: '#FAFAEE' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#fbfbf2', headerBackground: '#f5f4e6' },
    search: { activeHighlight: '#ff9800', highlight: '#FFF9C4', highlightText: '#000000' },
    electric: { glow: '#FFF9C4', glowText: '#000000' },
};

const yellowDark: AppPalette = {
    primary: { main: '#FFF59D', light: '#FFF9C4', dark: '#FBC02D', contrastText: '#423100' },
    secondary: { main: '#FFF176', light: '#FFF9C4', dark: '#F9A825', contrastText: '#5A4600' },
    background: { default: '#1C1C1A', paper: '#282820' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#FBC02D', highlightText: '#000000' },
    electric: { glow: '#FBC02D', glowText: '#000000' },
};

// ─── 16. Amber (#FFC107) ──────────────────────────────────────────
const amberLight: AppPalette = {
    primary: { main: '#FFC107', light: '#FFECB3', dark: '#FF6F00', contrastText: '#000000' },
    secondary: { main: '#FFA000', light: '#FFE082', dark: '#FF6F00', contrastText: '#000000' },
    background: { default: '#FEFCFA', paper: '#FAF7F1' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#fbf8f3', headerBackground: '#f4ede1' },
    search: { activeHighlight: '#ff9800', highlight: '#FFECB3', highlightText: '#000000' },
    electric: { glow: '#FFECB3', glowText: '#000000' },
};

const amberDark: AppPalette = {
    primary: { main: '#FFE082', light: '#FFECB3', dark: '#FFA000', contrastText: '#4C3000' },
    secondary: { main: '#FFD54F', light: '#FFECB3', dark: '#FF8F00', contrastText: '#624200' },
    background: { default: '#1C1B19', paper: '#282521' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#FFA000', highlightText: '#000000' },
    electric: { glow: '#FFA000', glowText: '#000000' },
};

// ─── 17. Orange (#FF9800) ─────────────────────────────────────────
const orangeLight: AppPalette = {
    primary: { main: '#FF9800', light: '#FFE0B2', dark: '#E65100', contrastText: '#000000' },
    secondary: { main: '#F57C00', light: '#FFCC80', dark: '#E65100', contrastText: '#FFFFFF' },
    background: { default: '#FEFBFA', paper: '#FAF4EF' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#fbf6f2', headerBackground: '#f3e8dd' },
    search: { activeHighlight: '#ff9800', highlight: '#FFE0B2', highlightText: '#000000' },
    electric: { glow: '#FFE0B2', glowText: '#000000' },
};

const orangeDark: AppPalette = {
    primary: { main: '#FFCC80', light: '#FFE0B2', dark: '#F57C00', contrastText: '#4F2300' },
    secondary: { main: '#FFB74D', light: '#FFE0B2', dark: '#EF6C00', contrastText: '#683000' },
    background: { default: '#1C1A19', paper: '#282421' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#F57C00', highlightText: '#FFFFFF' },
    electric: { glow: '#F57C00', glowText: '#000000' },
};

// ─── 18. Deep Orange (#FF5722) ────────────────────────────────────
const deepOrangeLight: AppPalette = {
    primary: { main: '#FF5722', light: '#FFCCBC', dark: '#BF360C', contrastText: '#FFFFFF' },
    secondary: { main: '#E64A19', light: '#FFAB91', dark: '#BF360C', contrastText: '#FFFFFF' },
    background: { default: '#FEFAFA', paper: '#FAF2EF' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#fbf4f2', headerBackground: '#f2e5df' },
    search: { activeHighlight: '#ff9800', highlight: '#FFCCBC', highlightText: '#000000' },
    electric: { glow: '#FFCCBC', glowText: '#000000' },
};

const deepOrangeDark: AppPalette = {
    primary: { main: '#FFAB91', light: '#FFCCBC', dark: '#E64A19', contrastText: '#561600' },
    secondary: { main: '#FF8A65', light: '#FFCCBC', dark: '#D84315', contrastText: '#6E1F00' },
    background: { default: '#1C1919', paper: '#282322' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#E64A19', highlightText: '#FFFFFF' },
    electric: { glow: '#E64A19', glowText: '#000000' },
};

// ─── 19. Brown (#795548) ──────────────────────────────────────────
const brownLight: AppPalette = {
    primary: { main: '#795548', light: '#D7CCC8', dark: '#3E2723', contrastText: '#FFFFFF' },
    secondary: { main: '#5D4037', light: '#BCAAA4', dark: '#3E2723', contrastText: '#FFFFFF' },
    background: { default: '#FDFBFA', paper: '#F7F5F4' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f8f6f5', headerBackground: '#edebe9' },
    search: { activeHighlight: '#ff9800', highlight: '#D7CCC8', highlightText: '#000000' },
    electric: { glow: '#D7CCC8', glowText: '#000000' },
};

const brownDark: AppPalette = {
    primary: { main: '#BCAAA4', light: '#D7CCC8', dark: '#5D4037', contrastText: '#2C160F' },
    secondary: { main: '#A1887F', light: '#D7CCC8', dark: '#4E342E', contrastText: '#3B2119' },
    background: { default: '#1B1A19', paper: '#272524' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#5D4037', highlightText: '#FFFFFF' },
    electric: { glow: '#5D4037', glowText: '#000000' },
};

// ─── 20. Grey (#9E9E9E) ───────────────────────────────────────────
const greyLight: AppPalette = {
    primary: { main: '#9E9E9E', light: '#F5F5F5', dark: '#212121', contrastText: '#000000' },
    secondary: { main: '#616161', light: '#EEEEEE', dark: '#212121', contrastText: '#FFFFFF' },
    background: { default: '#FAFAFA', paper: '#F2F2F2' },
    text: { primary: '#1C1B1F', secondary: '#49454F' },
    codeBlock: { background: '#f4f4f4', headerBackground: '#e8e8e8' },
    search: { activeHighlight: '#ff9800', highlight: '#EEEEEE', highlightText: '#000000' },
    electric: { glow: '#EEEEEE', glowText: '#000000' },
};

const greyDark: AppPalette = {
    primary: { main: '#EEEEEE', light: '#F5F5F5', dark: '#616161', contrastText: '#1B1B1B' },
    secondary: { main: '#E0E0E0', light: '#F5F5F5', dark: '#424242', contrastText: '#262626' },
    background: { default: '#1B1B1B', paper: '#252525' },
    text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
    codeBlock: { background: '#0d1117', headerBackground: '#161b22' },
    search: { activeHighlight: '#ff9800', highlight: '#616161', highlightText: '#FFFFFF' },
    electric: { glow: '#616161', glowText: '#000000' },
};

// ─── All Palettes ─────────────────────────────────────────────────

export const palettes: PaletteEntry[] = [
    { name: 'red', light: redLight, dark: redDark },
    { name: 'pink', light: pinkLight, dark: pinkDark },
    { name: 'purple', light: purpleLight, dark: purpleDark }, // Original M3 Purple
    { name: 'material-purple', light: materialPurpleLight, dark: materialPurpleDark },
    { name: 'deep-purple', light: deepPurpleLight, dark: deepPurpleDark },
    { name: 'indigo', light: indigoLight, dark: indigoDark },
    { name: 'blue', light: blueLight, dark: blueDark },
    { name: 'light-blue', light: lightBlueLight, dark: lightBlueDark },
    { name: 'cyan', light: cyanLight, dark: cyanDark },
    { name: 'teal', light: tealLight, dark: tealDark },
    { name: 'green', light: greenLight, dark: greenDark },
    { name: 'light-green', light: lightGreenLight, dark: lightGreenDark },
    { name: 'lime', light: limeLight, dark: limeDark },
    { name: 'yellow', light: yellowLight, dark: yellowDark },
    { name: 'amber', light: amberLight, dark: amberDark },
    { name: 'orange', light: orangeLight, dark: orangeDark },
    { name: 'deep-orange', light: deepOrangeLight, dark: deepOrangeDark },
    { name: 'brown', light: brownLight, dark: brownDark },
    { name: 'grey', light: greyLight, dark: greyDark },
    { name: 'blue-grey', light: blueGreyLight, dark: blueGreyDark },
];

export const getPaletteByName = (name: string): PaletteEntry =>
    palettes.find(p => p.name === name) ?? palettes[0];

export const getRandomPalette = (): PaletteEntry =>
    palettes[Math.floor(Math.random() * palettes.length)];
