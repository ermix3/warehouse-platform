import { BaseEntity, DataPagination, SharedData, Timestamps } from '@/types';

export interface CustomerRequest {
    code: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    shipping_tax: number;
    handling_tax: number;
}

export interface CustomerLite extends Pick<BaseEntity, 'id'> {
    code: string;
    name: string;
}

export interface Customer extends CustomerLite, Timestamps {
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
    shipping_tax?: number;
    handling_tax?: number;
    unique_products_bought_count?: number;
    orders_count?: number;
}

export interface PageCustomerProps extends SharedData {
    customers: DataPagination<Customer>;
}

export interface CreateCustomerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditCustomerProps extends CreateCustomerProps {
    customer: Customer | null;
}
