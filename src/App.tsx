import { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';
import { FileProvider, useFile } from './context/FileContext';
import { ThemeContextProvider, useColorMode } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';
import { PWAProvider } from './context/PWAContext';
import Layout from './components/Layout';
import MarkdownReader from './components/MarkdownReader';
import { sampleMarkdown } from './sampleMarkdown';

// Inner component to access FileContext
const AppContent = () => {
  const { currentFile } = useFile();

  // Fallback content if no file selected
  const content = currentFile ? currentFile.content : sampleMarkdown;

  return (
    <Layout>
      <MarkdownReader content={content} />
    </Layout>
  );
};

// ... imports

// ... imports

const MainApp = () => {
  const { mode } = useColorMode();
  const theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PWAProvider>
        <SearchProvider>
          <FileProvider>
            <AppContent />
          </FileProvider>
        </SearchProvider>
      </PWAProvider>
    </ThemeProvider>
  );
};

function App() {
  return (
    <ThemeContextProvider>
      <MainApp />
    </ThemeContextProvider>
  );
}

export default App;
