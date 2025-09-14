import { type DataPagination } from '@/types';

export interface CustomerLite {
    id: number;
    name: string;
}

export interface Customer {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
    unique_products_bought_count: number;
    orders_count: number;
    created_at?: string;
    updated_at?: string;
}

export interface PageCustomerProps {
    customers: DataPagination<Customer>;
    search: string;
    flash?: { success?: string };
    [key: string]: unknown;
}

export interface CreateCustomerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditCustomerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer: Customer | null;
}
