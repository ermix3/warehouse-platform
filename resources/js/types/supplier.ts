import { DataPagination, Filters, Flash } from '@/types';

export interface SupplierLite {
    id: number;
    name: string;
}

export interface Supplier {
    id: number;
    code: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
    products_count: number;
    created_at?: string;
    updated_at?: string;
}

export interface PageSupplierProps {
    suppliers: DataPagination<Supplier>;
    filters: Filters;
    flash?: Flash;
    [key: string]: unknown;
}

export interface CreateSupplierProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditSupplierProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplier: Supplier | null;
}
