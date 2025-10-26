'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface TenantContextType {
    domain: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
    const [domain, setDomain] = useState<string | null>(null);

    // Détecte automatiquement le domaine
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDomain(window.location.hostname);
        }
    }, []);

    return (
        <TenantContext.Provider value={{ domain }}>
            {children}
        </TenantContext.Provider>
    );
}

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenant must be used within TenantProvider');
    }
    return context;
};
