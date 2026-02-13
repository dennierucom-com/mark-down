import { createContext, useContext } from 'react';

export interface MarkdownFile {
    name: string;
    path?: string; // Optional path (mostly for FS Access files)
    content: string;
    handle?: FileSystemFileHandle; // Optional handle for saving back
    isImported?: boolean;
}

export interface FileContextType {
    files: MarkdownFile[];
    currentFile: MarkdownFile | null;
    addFile: (file: MarkdownFile) => void;
    selectFile: (fileName: string) => void;
    setWorkspaceFiles: (files: MarkdownFile[]) => void;
}

export const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFile = () => {
    const context = useContext(FileContext);
    if (context === undefined) {
        throw new Error('useFile must be used within a FileProvider');
    }
    return context;
};
