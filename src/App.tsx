import { useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { buildTheme } from "./theme/theme";
import { getPaletteByName } from "./theme/palette";
import { useFile } from "./context/FileContext";
import { FileProvider } from "./context/FileProvider";
import { useColorMode } from "./context/ThemeContext";
import { ThemeContextProvider } from "./context/ThemeContextProvider";
import { SearchProvider } from "./context/SearchProvider";
import { PWAProvider } from "./context/PWAProvider";
import Layout from "./components/Layout";
import MarkdownReader from "./components/MarkdownReader";
import { sampleMarkdown } from "./sampleMarkdown";

const AppContent = () => {
  const { currentFile, updateCurrentFileContent } = useFile();
  const content = currentFile ? currentFile.content : sampleMarkdown;

  return (
    <Layout>
      <MarkdownReader 
        content={content} 
        onContentChange={updateCurrentFileContent}
      />
    </Layout>
  );
};

const MainApp = () => {
  const { mode, paletteName } = useColorMode();
  const theme = useMemo(() => {
    const entry = getPaletteByName(paletteName);
    const palette = mode === "dark" ? entry.dark : entry.light;
    return buildTheme(palette, mode);
  }, [mode, paletteName]);

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
