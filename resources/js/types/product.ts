import { Category, CategoryLite, DataPagination, Supplier, SupplierLite } from '@/types';

export interface ProductLite {
    id: number;
    name: string;
}

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
    category?: CategoryLite;
    supplier?: SupplierLite;
}

export interface PageProductProps {
    products: DataPagination<Product>;
    categories: Category[];
    suppliers: Supplier[];
    search: string;
    flash?: { success?: string };
    [key: string]: unknown;
}

export interface CreateProductProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
    suppliers: Supplier[];
}

export interface EditProductProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    categories: Category[];
    suppliers: Supplier[];
}
