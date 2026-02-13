import React, { useState, type ReactNode } from 'react';
import { FileContext, type MarkdownFile } from './FileContext';

export const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [files, setFiles] = useState<MarkdownFile[]>([]);
    const [currentFile, setCurrentFile] = useState<MarkdownFile | null>(null);

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
            const imported = prevFiles.filter(f => f.isImported);
            return [...imported, ...newFiles];
        });
        if (newFiles.length > 0 && !currentFile) {
            setCurrentFile(newFiles[0]);
        }
    };

    const selectFile = (fileName: string) => {
        const file = files.find((f) => f.name === fileName);
        if (file) {
            setCurrentFile(file);
        }
    };

    return (
        <FileContext.Provider value={{ files, currentFile, addFile, selectFile, setWorkspaceFiles }}>
            {children}
        </FileContext.Provider>
    );
};
