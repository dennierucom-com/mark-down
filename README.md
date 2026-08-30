# Markdown Editor & Viewer

A modern, fast, and feature-rich Markdown Editor built with React, Vite, and Material-UI. This application offers a seamless experience for creating, editing, and previewing markdown files with advanced features like local file system access, progressive web app (PWA) capabilities, and extensive customization options.

## Features

### Core Functionality
- **Dual-Pane Interface**: Edit markdown on one side and see a live preview on the other.
- **File System Access**: Open, edit, and save files directly to your local file system (using the File System Access API).
- **Workspace Management**: Manage multiple markdown files in a sidebar.
- **Unsaved Changes Dialog**: Get prompted to save your work before closing or navigating away from dirty files.
- **Keyboard Shortcuts**: Navigate and control the application using convenient keyboard shortcuts (e.g., Ctrl+S to save).

### UI & UX
- **Dynamic Theming**: Support for both Light and Dark modes, with 19 customizable Material Design 2014 color palettes (rotates randomly).
- **Top App Bar**: Quick access to file operations, theme switching, and viewing modes.
- **Action Speed Dial**: Floating action button for quick actions on mobile/smaller screens.
- **Fullscreen Mode**: Immerse yourself in writing or reading without distractions.
- **Reader Toolbar**: Easily switch between Editor-only, Viewer-only, or Split-pane views.

### Technical Highlights
- **React + Vite**: Fast development server and optimized production builds.
- **Progressive Web App (PWA)**: Install the app on your device for offline use and a native-like experience.
- **Material-UI (MUI)**: Beautiful and responsive component library.
- **TypeScript**: Fully typed codebase for reliability and maintainability.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd mark-down
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/components/`: Reusable UI components (Sidebar, Layout, TopAppBar, ActionSpeedDial, etc.)
- `src/components/MarkdownReader/`: Core markdown editing and viewing components.
- `src/context/`: React Context providers for state management (FileContext, ThemeContext, DialogContext, etc.)
- `src/hooks/`: Custom React hooks (useFullscreen, useKeyboardShortcuts, etc.)
- `src/theme/`: Material-UI theme configurations and color palettes.

## Recent Updates

- **Expanded Dynamic Theming**: Integrated all 19 official color palettes from the 2014 Material Design specifications.
- Added `TopAppBar` and `ActionSpeedDial` for improved navigation and mobile support.
- Refactored context and state management into modular providers (`DialogProvider`, `FileProvider`, etc.).
- Introduced `useFullscreen` and `useKeyboardShortcuts` hooks for enhanced user experience.
- Added `UnsavedChangesDialog` to prevent accidental data loss.
- Improved Markdown Reader with customizable toolbars and flexible viewing modes.
