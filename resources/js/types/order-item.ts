import type { Order, Product, ProductLite } from '@/types';

export interface OrderItemLite {
    id?: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    product?: ProductLite;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    created_at?: string;
    updated_at?: string;
    product?: Product;
    order?: Order;
}
