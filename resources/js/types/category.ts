import { DataPagination, type Filters, Flash } from '@/types/index';

export interface CategoryLite {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    products_count: number;
    created_at?: string;
    updated_at?: string;
}

export interface PageCategoryProps {
    categories: DataPagination<Category>;
    filters: Filters;
    flash?: Flash;
    [key: string]: unknown;
}

export interface CreateCategoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditCategoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null;
}
