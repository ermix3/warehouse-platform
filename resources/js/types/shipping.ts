import { PaginationLink } from '@/types';

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

export interface ShippingPagination {
    data: Shipping[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
