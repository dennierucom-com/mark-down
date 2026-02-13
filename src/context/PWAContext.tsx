import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAContextType {
    isInstallable: boolean;
    installPWA: () => Promise<void>;
    simulateInstall: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const usePWAInstall = () => {
    const context = useContext(PWAContext);
    if (!context) {
        throw new Error('usePWAInstall must be used within a PWAProvider');
    }
    return context;
};

interface PWAProviderProps {
    children: ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            console.log('Markdowner: beforeinstallprompt captured', e);
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        console.log('Markdowner: PWA Provider initialized');

        window.addEventListener('appinstalled', () => {
            setDeferredPrompt(null);
            setIsInstallable(false);
            console.log('PWA was installed');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const installPWA = async () => {
        if (!deferredPrompt) {
            console.warn('No deferred prompt available');
            return;
        }

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response to install prompt: ${outcome}`);

        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    const simulateInstall = () => {
        console.log('Markdowner: Simulating install event');
        setIsInstallable(true);
    };

    return (
        <PWAContext.Provider value={{ isInstallable, installPWA, simulateInstall }}>
            {children}
        </PWAContext.Provider>
    );
};
