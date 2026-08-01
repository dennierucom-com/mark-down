import React, { useState, useEffect, type ReactNode } from "react";
import { FileContext, type MarkdownFile } from "./FileContext";
import { sampleMarkdown } from "../sampleMarkdown";

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [currentFile, setCurrentFile] = useState<MarkdownFile | null>(() => {
    const saved = localStorage.getItem("current_file");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { ...rest } = parsed;
        return rest as MarkdownFile;
      } catch (e) {
        console.error("Failed to parse saved file", e);
      }
    }
    return {
      name: "Welcome.md",
      content: sampleMarkdown,
      isImported: true,
    };
  });

  useEffect(() => {
    if (currentFile) {
      const { ...fileToSave } = currentFile;
      localStorage.setItem("current_file", JSON.stringify(fileToSave));

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFiles((prev) => {
        if (prev.some((f) => f.name === currentFile.name)) return prev;
        return [...prev, currentFile];
      });
    }
  }, [currentFile]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const addFile = (file: MarkdownFile) => {
    setFiles((prevFiles) => {
      const exists = prevFiles.some((f) => f.name === file.name);
      if (exists) return prevFiles;
      return [...prevFiles, { ...file, isImported: true }];
    });
    setCurrentFile(file);
    setIsDirty(false);
  };

  const setWorkspaceFiles = (newFiles: MarkdownFile[]) => {
    setFiles((prevFiles) => {
      const imported = prevFiles.filter((f) => f.isImported);
      return [...imported, ...newFiles];
    });
    if (newFiles.length > 0 && !currentFile) {
      setCurrentFile(newFiles[0]);
      setIsDirty(false);
    }
  };

  const selectFile = (fileName: string) => {
    const file = files.find((f) => f.name === fileName);
    if (file) {
      setCurrentFile(file);
      setIsDirty(false);
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
    setIsDirty(false);
  };

  const updateCurrentFileContent = (newContent: string) => {
    if (currentFile) {
      const updatedFile = { ...currentFile, content: newContent };
      setCurrentFile(updatedFile);
      setFiles((prev) =>
        prev.map((f) => (f.name === updatedFile.name ? updatedFile : f))
      );
      setIsDirty(true);
    }
  };

  const markClean = () => {
    setIsDirty(false);
  };

  const saveToHandle = async (): Promise<boolean> => {
    if (!currentFile?.handle) return false;
    try {
      const writable = await currentFile.handle.createWritable();
      await writable.write(currentFile.content);
      await writable.close();
      setIsDirty(false);
      return true;
    } catch (e) {
      console.error("Failed to save to handle", e);
      return false;
    }
  };

  const saveAsNewFile = async (): Promise<boolean> => {
    if (!currentFile) return false;
    try {
      // @ts-expect-error - File System Access API
      const handle = await window.showSaveFilePicker({
        suggestedName: currentFile.name,
        types: [{
          description: 'Markdown File',
          accept: { 'text/markdown': ['.md'] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(currentFile.content);
      await writable.close();
      
      const newFile: MarkdownFile = {
        name: handle.name,
        path: handle.name,
        content: currentFile.content,
        handle: handle,
        isImported: true,
      };
      
      setFiles((prev) => [...prev, newFile]);
      setCurrentFile(newFile);
      setIsDirty(false);
      return true;
    } catch (e) {
      console.error("Failed to save as new file", e);
      return false;
    }
  };

  const downloadFile = () => {
    if (!currentFile) return;
    const blob = new Blob([currentFile.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDirty(false);
  };

  return (
    <FileContext.Provider
      value={{
        files,
        currentFile,
        isDirty,
        addFile,
        selectFile,
        setWorkspaceFiles,
        clearFiles,
        updateCurrentFileContent,
        markClean,
        saveToHandle,
        saveAsNewFile,
        downloadFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
