import { ReactNode } from 'react';
import { TenantProvider } from '@/src/shared/lib/tenant-context';

export const metadata = {
  title: 'Admin Panel',
  description: 'Admin panel for managing your application',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <TenantProvider>
      {children}
    </TenantProvider>
  );
}