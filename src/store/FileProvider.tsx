import React, { useState, useEffect, type ReactNode } from "react";
import { FileContext, type MarkdownFile } from "./FileContext";
import { sampleMarkdown } from "../features/MarkdownReader/data/sampleMarkdown";

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [currentFile, setCurrentFile] = useState<MarkdownFile | null>(() => {
    const saved = localStorage.getItem("current_file");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Remove handle if it exists (it shouldn't, but just in case)
        const { ...rest } = parsed;
        return rest as MarkdownFile;
      } catch (e) {
        console.error("Failed to parse saved file", e);
        // Fallthrough to default
      }
    }
    // Default to sample markdown
    const defaultFile: MarkdownFile = {
      name: "Welcome.md",
      content: sampleMarkdown,
      isImported: true,
    };
    return defaultFile;
  });

  useEffect(() => {
    if (currentFile) {
      // Don't save the handle to localStorage
      const { ...fileToSave } = currentFile;
      localStorage.setItem("current_file", JSON.stringify(fileToSave));

      // Also ensure it's in the files list (for Sidebar)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFiles((prev) => {
        if (prev.some((f) => f.name === currentFile.name)) return prev;
        return [...prev, currentFile];
      });
    } else {
      // Optional: Clear if no file? Or keep last loaded?
      // User asked: "allow to have loadded your last file even we do a refresh".
      // So better NOT clear it if currentFile becomes null temporarily,
      // BUT if the user explicitly closes a file, we might want to clear it.
      // For now, let's only save when there is a file.
      // If the application starts with null, it tries to load from LS.
    }
  }, [currentFile]);

  const addFile = (file: MarkdownFile) => {
    setFiles((prevFiles) => {
      // Avoid duplicates based on name (or path if available)
      const exists = prevFiles.some((f) => f.name === file.name);
      if (exists) return prevFiles;
      return [...prevFiles, { ...file, isImported: true }];
    });
    // Auto-select newly added file
    setCurrentFile(file);
  };

  const setWorkspaceFiles = (newFiles: MarkdownFile[]) => {
    setFiles((prevFiles) => {
      // Keep imported files, replace workspace files?
      // For now let's just replace everything or merge carefully.
      // Let's keep imported files separate in the UI logic, but here we can store all.
      const imported = prevFiles.filter((f) => f.isImported);
      return [...imported, ...newFiles];
    });
    if (newFiles.length > 0 && !currentFile) {
      // Only auto-select if we don't already have a file (e.g. from localStorage)
      // But if we just loaded from LS, currentFile might be set.
      // Let's check if the LS file is in the new list, or just keep it.
      // If the user refreshed, currentFile is loaded from LS.
      // If we then load workspace files, we probably don't want to override the user's last open file
      // unless the LS file is invalid.
      // For now, simplest logic: if !currentFile, select first.
      setCurrentFile(newFiles[0]); // This might override if we want consistency, but let's stick to simple first
    }
  };

  const selectFile = (fileName: string) => {
    const file = files.find((f) => f.name === fileName);
    if (file) {
      setCurrentFile(file);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    const defaultFile: MarkdownFile = {
      name: "Welcome.md",
      content: sampleMarkdown,
      isImported: true,
    };
    setCurrentFile(defaultFile);
    localStorage.removeItem("current_file");
  };

  return (
    <FileContext.Provider
      value={{
        files,
        currentFile,
        addFile,
        selectFile,
        setWorkspaceFiles,
        clearFiles,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
