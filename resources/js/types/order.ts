import { Customer } from '@/types/customer';
import { PaginationLink } from '@/types/index';
import type { Shipping } from '@/types/shipping';

export interface Order {
    id: number;
    order_number: string;
    status: 'draft' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    customer_id: number;
    shipping_id: number;
    customer?: Customer;
    shipping?: Shipping;
    created_at?: string;
    updated_at?: string;
}

export interface OrderPagination {
    data: Order[];
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
