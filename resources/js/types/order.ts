import {
    Customer,
    CustomerLite,
    DataPagination,
    Filters,
    Flash,
    OrderItem,
    OrderItemLite,
    OrderStatus,
    Product,
    SharedEnums,
    Shipping,
    ShippingLite,
} from '@/types';

export interface OrderLite {
    id: number;
    order_number: OrderStatus;
    status: string;
    total: number;
}

export interface Order {
    id: number;
    order_number: string;
    status: OrderStatus;
    total: number;
    customer_id: number;
    shipping_id: number;
    customer?: Customer;
    shipping?: Shipping;
    items?: OrderItemLite[];
    created_at?: string;
    updated_at?: string;
}

export interface PageOrderProps {
    orders: DataPagination<Order>;
    customers: CustomerLite[];
    shippings: ShippingLite[];
    products: Product[];
    filters: Filters;
    flash?: Flash;
    enums: SharedEnums;
    [key: string]: unknown;
}

export interface CreateOrderProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: CustomerLite[];
    shippings: ShippingLite[];
    products: Product[];
}

export interface EditOrderProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
    customers: CustomerLite[];
    shippings: ShippingLite[];
    products: Product[];
}

export interface ShowOrderProps {
    customer: Customer;
    filters: Filters;
    flash?: Flash;
    enums: SharedEnums;
    order: Order;
    orderItems: DataPagination<OrderItem>;
    products: Product[];
    [key: string]: unknown;
}
