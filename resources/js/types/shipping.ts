import { DataPagination } from '@/types';

export interface ShippingLite {
    id: number;
    tracking_number?: string;
    carrier?: string;
}

export interface Shipping {
    id: number;
    tracking_number?: string;
    carrier?: string;
    status: string;
    total: number;
    orders_count: number;
    created_at?: string;
    updated_at?: string;
}

export interface PageShippingProps {
    shippings: DataPagination<Shipping>;
    search: string;
    flash?: { success?: string };
    [key: string]: unknown;
}

export interface CreateShippingProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditShippingProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shipping: Shipping | null;
}
