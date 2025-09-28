import type { BaseEntity, Order, ProductLite, Timestamps } from '@/types';

export interface OrderItemRequest {
    product_id: string;
    ctn: string;
}

export interface OrderItemLite extends Pick<BaseEntity, 'id'> {
    ctn: number;
    product: ProductLite;
}

export interface OrderItem extends OrderItemLite, Timestamps {
    order?: Order;
}
