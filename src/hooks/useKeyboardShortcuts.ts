import { useEffect } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutConfig {
  key: string;
  ctrlOrMetaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: ShortcutHandler;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const matchCtrlMeta = shortcut.ctrlOrMetaKey ? (e.ctrlKey || e.metaKey) : true;
        const matchShift = shortcut.shiftKey !== undefined ? e.shiftKey === shortcut.shiftKey : true;
        const matchAlt = shortcut.altKey !== undefined ? e.altKey === shortcut.altKey : true;
        
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          matchCtrlMeta &&
          matchShift &&
          matchAlt
        ) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault();
          }
          shortcut.handler(e);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
