import { createContext, useContext } from 'react';

export interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface PWAContextType {
    isInstallable: boolean;
    installPWA: () => Promise<void>;
    simulateInstall: () => void;
}

export const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const usePWAInstall = () => {
    const context = useContext(PWAContext);
    if (!context) {
        throw new Error('usePWAInstall must be used within a PWAProvider');
    }
    return context;
};
