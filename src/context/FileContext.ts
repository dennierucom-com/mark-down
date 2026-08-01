import { createContext, useContext } from 'react';

export interface MarkdownFile {
    name: string;
    path?: string; // Optional path (mostly for FS Access files)
    content: string;
    handle?: FileSystemFileHandle; // Optional handle for saving back
    isImported?: boolean;
}

export type PendingAction = 
    | { type: 'switch'; fileName: string }
    | { type: 'clear' }
    | { type: 'custom'; action: () => void };

export interface FileContextType {
    files: MarkdownFile[];
    currentFile: MarkdownFile | null;
    isDirty: boolean;
    addFile: (file: MarkdownFile) => void;
    selectFile: (fileName: string) => void;
    setWorkspaceFiles: (files: MarkdownFile[]) => void;
    clearFiles: () => void;
    updateCurrentFileContent: (newContent: string) => void;
    markClean: () => void;
    saveToHandle: () => Promise<boolean>;
    saveAsNewFile: () => Promise<boolean>;
    downloadFile: () => void;
    pendingAction: PendingAction | null;
    requestFileSwitch: (fileName: string) => void;
    requestClearFiles: () => void;
    requestCustomAction: (action: () => void) => void;
    confirmPendingAction: () => void;
    cancelPendingAction: () => void;
    saveDialogRequested: boolean;
    requestSave: () => void;
    clearSaveRequest: () => void;
    // Save-with-discard flow: triggers UnsavedChangesDialog with a Discard option
    saveWithDiscardRequested: boolean;
    requestSaveWithDiscard: (onDiscard: () => void, onCancel: () => void) => void;
    executeSaveWithDiscardDiscard: () => void;
    executeSaveWithDiscardCancel: () => void;
    clearSaveWithDiscardRequest: () => void;
}

export const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFile = () => {
    const context = useContext(FileContext);
    if (context === undefined) {
        throw new Error('useFile must be used within a FileProvider');
    }
    return context;
};
