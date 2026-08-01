import { createContext, useContext } from 'react';

export type PendingAction = 
  | { type: 'switch'; fileName: string }
  | { type: 'clear' }
  | { type: 'custom'; action: () => void };

export interface DialogContextType {
  pendingAction: PendingAction | null;
  requestActionWithUnsavedChanges: (action: PendingAction, isDirty: boolean, immediateFallback?: () => void) => void;
  confirmPendingAction: () => void;
  cancelPendingAction: () => void;

  saveDialogRequested: boolean;
  requestSaveDialog: () => void;
  clearSaveDialogRequest: () => void;

  saveWithDiscardRequested: boolean;
  requestSaveWithDiscard: (onDiscard: () => void, onCancel: () => void) => void;
  executeSaveWithDiscardDiscard: () => void;
  executeSaveWithDiscardCancel: () => void;
  clearSaveWithDiscardRequest: () => void;
}

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
