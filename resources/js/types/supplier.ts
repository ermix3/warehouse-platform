import type { PaginationLink } from '@/types';

export interface Supplier {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
    products_count: number;
    created_at?: string;
    updated_at?: string;
}

export interface SupplierPagination {
    data: Supplier[];
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
