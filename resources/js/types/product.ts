import { PaginationLink } from '@/types';

export interface Product {
    id: number;
    barcode: string;
    name: string;
    description?: string;
    origin: string;
    hs_code: string;
    net_weight: number;
    box_weight: number;
    category_id: number;
    supplier_id?: number | null;
    created_at?: string;
    updated_at?: string;
    category?: {
        id: number;
        name: string;
    };
    supplier?: {
        id: number;
        name: string;
    };
}

export interface ProductPagination {
    data: Product[];
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
