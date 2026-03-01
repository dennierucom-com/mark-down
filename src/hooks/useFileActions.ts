import { useFile, type MarkdownFile } from '../context/FileContext';

export const useFileActions = () => {
    const { addFile, setWorkspaceFiles, clearFiles } = useFile();

    const handleOpenFolder = async () => {
        try {
            // @ts-expect-error - File System Access API
            const dirHandle = await window.showDirectoryPicker();
            const newFiles: MarkdownFile[] = [];

            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file' && entry.name.endsWith('.md')) {
                    const file = await entry.getFile();
                    const text = await file.text();
                    newFiles.push({
                        name: entry.name,
                        path: entry.name,
                        content: text,
                        handle: entry
                    });
                }
            }
            setWorkspaceFiles(newFiles);
        } catch (err) {
            console.error("Error accessing folder:", err);
        }
    };

    const handleManualInject = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.markdown';
        input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                const text = await file.text();
                addFile({
                    name: file.name,
                    content: text,
                    isImported: true
                });
            }
        };
        input.click();
    };

    return { handleOpenFolder, handleManualInject, clearFiles };
};
