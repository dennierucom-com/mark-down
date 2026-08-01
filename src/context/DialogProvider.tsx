import React, { useState, useRef, type ReactNode } from "react";
import { DialogContext, type PendingAction } from "./DialogContext";

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [saveDialogRequested, setSaveDialogRequested] = useState(false);
  const [saveWithDiscardRequested, setSaveWithDiscardRequested] = useState(false);
  
  const saveWithDiscardCallbacksRef = useRef<{ onDiscard: () => void; onCancel: () => void } | null>(null);

  const requestActionWithUnsavedChanges = (action: PendingAction, isDirty: boolean, immediateFallback?: () => void) => {
    if (isDirty) {
      setPendingAction(action);
    } else if (immediateFallback) {
      immediateFallback();
    }
  };

  const confirmPendingAction = () => {
    if (!pendingAction) return;
    // We will let the consumer components (like Layout) handle the actual action execution
    // because they have access to FileContext. Alternatively, we could pass callbacks.
    // Actually, `confirmPendingAction` needs to know what to do, but since it's just state:
    // Layout listens to pendingAction and executes it when the dialog confirms.
    // Wait, the action execution logic relies on FileContext.
    // Let's keep it simple: the DialogContext just holds the action. 
    // The consumer clears it.
    // We should pass a callback to execute it, or let the consumer handle the side effect.
    setPendingAction(null);
  };

  const cancelPendingAction = () => {
    setPendingAction(null);
  };

  const requestSaveDialog = () => {
    setSaveDialogRequested(true);
  };

  const clearSaveDialogRequest = () => {
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
    <DialogContext.Provider
      value={{
        pendingAction,
        requestActionWithUnsavedChanges,
        confirmPendingAction,
        cancelPendingAction,

        saveDialogRequested,
        requestSaveDialog,
        clearSaveDialogRequest,

        saveWithDiscardRequested,
        requestSaveWithDiscard,
        executeSaveWithDiscardDiscard,
        executeSaveWithDiscardCancel,
        clearSaveWithDiscardRequest,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};
