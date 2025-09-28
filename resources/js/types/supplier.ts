import type { BaseEntity, DataPagination, SharedData, Timestamps } from '@/types';

export interface SupplierRequest {
    code: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
}

export interface SupplierLite extends Pick<BaseEntity, 'id'> {
    code: string;
    name: string;
}

export interface Supplier extends SupplierLite, Timestamps {
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
}

export interface PageSupplierProps extends SharedData {
    suppliers: DataPagination<Supplier>;
}

export interface CreateSupplierProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditSupplierProps extends CreateSupplierProps {
    supplier: Supplier | null;
}
