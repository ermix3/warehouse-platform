import type { BaseEntity, DataPagination, SharedData } from '@/types';

export interface ProductRequest {
    barcode: string;
    name: string;
    description: string;
    origin: string;
    hs_code: string;
    unit_price: number;
    box_qtt: number;
    height: number;
    length: number;
    width: number;
    net_weight: number;
    box_weight: number;
}

export interface ProductLite extends Pick<BaseEntity, 'id'> {
    name: string;
    barcode: string;
    box_qtt: number;
    unit_price: number;
}

export interface Product extends ProductLite {
    description?: string;
    origin: string;
    hs_code: string;
    height: number;
    length: number;
    width: number;
    net_weight: number;
    box_weight: number;
    orders_count?: number;
}

export interface PageProductProps extends SharedData {
    products: DataPagination<Product>;
}

export interface CreateProductProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditProductProps extends CreateProductProps {
    product: Product | null;
}
