import type { Order, Product, ProductLite } from '@/types';

export interface OrderItemLite {
    id?: number;
    product_id: number;
    ctn: number;
    product?: ProductLite;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    ctn: number;
    created_at?: string;
    updated_at?: string;
    product?: Product;
    order?: Order;
}
