/**
 * Shared TypeScript types and interfaces.
 *
 * Re-exports commonly used types from across the application
 * for convenience and consistency.
 */

// File-related types
export type { MarkdownFile, FileContextType } from "../store/FileContext";

// Theme-related types
export type { AppPalette, PaletteEntry } from "../theme/palette";
export type { ThemeContextType } from "../store/ThemeContext";

// Search-related types
export type { SearchContextType } from "../store/SearchContext";

// PWA-related types
export type {
  BeforeInstallPromptEvent,
  PWAContextType,
} from "../features/PWA/context/PWAContext";
