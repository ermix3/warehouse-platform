import type { Order, Product, ProductLite } from '@/types';
import { PaginationLink } from '@/types';

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

export interface OrderItemPagination {
    data: OrderItem[];
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
