'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface TenantContextType {
    tenantId: string | null;
    domain: string | null;
    setTenantId: (tenantId: string | null) => void;
    setDomain: (domain: string | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [domain, setDomain] = useState<string | null>(null);

    // Load tenant data from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedTenantId = localStorage.getItem('tenant_id');
            const storedDomain = localStorage.getItem('tenant_domain');

            if (storedTenantId) setTenantId(storedTenantId);
            if (storedDomain) setDomain(storedDomain);

            // Also detect domain from hostname if not stored
            if (!storedDomain) {
                setDomain(window.location.hostname);
            }
        }
    }, []);

    // Persist to localStorage when tenantId or domain changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (tenantId) {
                localStorage.setItem('tenant_id', tenantId);
            } else {
                localStorage.removeItem('tenant_id');
            }
        }
    }, [tenantId]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (domain) {
                localStorage.setItem('tenant_domain', domain);
            } else {
                localStorage.removeItem('tenant_domain');
            }
        }
    }, [domain]);

    return (
        <TenantContext.Provider value={{ tenantId, domain, setTenantId, setDomain }}>
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
