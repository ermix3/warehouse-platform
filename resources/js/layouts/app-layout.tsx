import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, Flash } from '@/types';
import { ReactNode, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    flash?: Flash;
}

export default ({ children, breadcrumbs, flash, ...props }: AppLayoutProps) => {
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash?.success, {
                duration: 8000,
            });
        }

        if (flash?.error) {
            toast.error(flash?.error, {
                duration: 8000,
            });
        }
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <Toaster position="top-right" expand={false} richColors closeButton />
            {children}
        </AppLayoutTemplate>
    );
};
