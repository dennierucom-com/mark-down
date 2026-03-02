import React, { useState, useEffect, type ReactNode } from "react";
import { useMediaQuery } from "@mui/material";
import { ThemeContext } from "./ThemeContext";
import { getPaletteByName, getRandomPalette } from "../theme/palette";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const resolveActivePalette = (): string => {
  const savedName = localStorage.getItem("palette_name");
  const savedAt = localStorage.getItem("palette_changed_at");

  if (savedName && savedAt) {
    const elapsed = Date.now() - parseInt(savedAt, 10);
    if (elapsed < SEVEN_DAYS_MS) {
      // Still within the 7-day window — keep current palette
      return savedName;
    }
  }

  // First visit or 7 days have passed — pick a random palette
  const newPalette = getRandomPalette();
  localStorage.setItem("palette_name", newPalette.name);
  localStorage.setItem("palette_changed_at", Date.now().toString());
  return newPalette.name;
};

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme_mode");
    return saved === "light" || saved === "dark"
      ? saved
      : prefersDarkMode
        ? "dark"
        : "light";
  });

  const [paletteName] = useState<string>(() => resolveActivePalette());

  // Validate the palette exists (fallback to first palette if somehow invalid)
  getPaletteByName(paletteName);

  useEffect(() => {
    localStorage.setItem("theme_mode", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, paletteName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
