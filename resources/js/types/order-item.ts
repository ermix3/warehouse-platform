import type { BaseEntity, Order, ProductLite, Timestamps } from '@/types';
import type { FormDataConvertible } from '@inertiajs/core';

export interface OrderItemRequest {
    product_id: string;
    ctn: number;
    box_code: string | null;
}

export interface OrderItemLite extends Pick<BaseEntity, 'id'> {
    ctn: number;
    product: ProductLite;
}

export interface OrderItem extends OrderItemLite, Timestamps {
    order?: Order;
}

export interface OrderItemUpdate extends OrderItem {
    box_qtt: number;
    sum: number;
    unit_price: number;
    box_code: string;
}

export interface OrderItemUpdateRequest extends Record<string, FormDataConvertible> {
    ctn?: number;
    box_qtt?: number;
    sum?: number;
    unit_price?: number;
    [key: string]: FormDataConvertible | undefined;
}
