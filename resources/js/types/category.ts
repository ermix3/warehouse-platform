import { PaginationLink } from '@/types';

export interface Category {
    id: number;
    name: string;
    description?: string;
    products_count: number;
    created_at?: string;
    updated_at?: string;
}

export interface CategoryPagination {
    data: Category[];
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
