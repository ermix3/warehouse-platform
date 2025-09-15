import { DataPagination, type Filters, Flash, Supplier, SupplierLite } from '@/types';

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
    unit_price: number;
    box_qtt: number;
    height: number;
    length: number;
    width: number;
    net_weight: number;
    box_weight: number;
    supplier_id?: number | null;
    created_at?: string;
    updated_at?: string;
    supplier?: SupplierLite;
}

export interface PageProductProps {
    products: DataPagination<Product>;
    suppliers: Supplier[];
    filters: Filters;
    flash?: Flash;
    [key: string]: unknown;
}

export interface CreateProductProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    suppliers: Supplier[];
}

export interface EditProductProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    suppliers: Supplier[];
}
