import React, { useState, useEffect, type ReactNode } from "react";
import { FileContext, type MarkdownFile, type PendingAction } from "./FileContext";
import { sampleMarkdown } from "../sampleMarkdown";

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [saveDialogRequested, setSaveDialogRequested] = useState(false);
  const [saveWithDiscardRequested, setSaveWithDiscardRequested] = useState(false);
  const saveWithDiscardCallbacksRef = React.useRef<{ onDiscard: () => void; onCancel: () => void } | null>(null);
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
      // Avoid duplicates based on name (or path if available)
      const exists = prevFiles.some((f) => f.name === file.name);
      if (exists) return prevFiles;
      return [...prevFiles, { ...file, isImported: true }];
    });
    // Auto-select newly added file
    setCurrentFile(file);
    setIsDirty(false);
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

  const requestFileSwitch = (fileName: string) => {
    if (isDirty) {
      setPendingAction({ type: 'switch', fileName });
    } else {
      selectFile(fileName);
    }
  };

  const requestClearFiles = () => {
    if (isDirty) {
      setPendingAction({ type: 'clear' });
    } else {
      clearFiles();
    }
  };

  const requestCustomAction = (action: () => void) => {
    if (isDirty) {
      setPendingAction({ type: 'custom', action });
    } else {
      action();
    }
  };

  const confirmPendingAction = () => {
    if (!pendingAction) return;
    
    if (pendingAction.type === 'switch') {
      selectFile(pendingAction.fileName);
    } else if (pendingAction.type === 'clear') {
      clearFiles();
    } else if (pendingAction.type === 'custom') {
      pendingAction.action();
    }
    
    setPendingAction(null);
    setIsDirty(false);
  };

  const cancelPendingAction = () => {
    setPendingAction(null);
  };

  const requestSave = () => {
    setSaveDialogRequested(true);
  };

  const clearSaveRequest = () => {
    setSaveDialogRequested(false);
  };

  const requestSaveWithDiscard = (onDiscard: () => void, onCancel: () => void) => {
    saveWithDiscardCallbacksRef.current = { onDiscard, onCancel };
    setSaveWithDiscardRequested(true);
  };

  const clearSaveWithDiscardRequest = () => {
    saveWithDiscardCallbacksRef.current = null;
    setSaveWithDiscardRequested(false);
  };

  const executeSaveWithDiscardDiscard = () => {
    saveWithDiscardCallbacksRef.current?.onDiscard();
    clearSaveWithDiscardRequest();
  };

  const executeSaveWithDiscardCancel = () => {
    saveWithDiscardCallbacksRef.current?.onCancel();
    clearSaveWithDiscardRequest();
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
        pendingAction,
        requestFileSwitch,
        requestClearFiles,
        requestCustomAction,
        confirmPendingAction,
        cancelPendingAction,
        saveDialogRequested,
        requestSave,
        clearSaveRequest,
        saveWithDiscardRequested,
        requestSaveWithDiscard,
        executeSaveWithDiscardDiscard,
        executeSaveWithDiscardCancel,
        clearSaveWithDiscardRequest,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
