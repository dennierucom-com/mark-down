import { useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { buildTheme } from "./theme/theme";
import { getPaletteByName } from "./theme/palette";
import { useColorMode } from "./store/ThemeContext";
import { ThemeContextProvider } from "./store/ThemeContextProvider";
import { FileProvider } from "./store/FileProvider";
import { SearchProvider } from "./store/SearchProvider";
import { PWAProvider } from "./features/PWA/context/PWAProvider";
import HomePage from "./pages/HomePage";

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
            <HomePage />
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
