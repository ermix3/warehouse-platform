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
    Shipment,
    ShipmentLite,
    SupplierLite,
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
    shipment_id: number;
    supplier_id?: number | null;
    supplier?: SupplierLite;
    customer?: Customer;
    shipment?: Shipment;
    items?: OrderItemLite[];
    items_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface PageOrderProps {
    orders: DataPagination<Order>;
    customers: CustomerLite[];
    suppliers: SupplierLite[];
    shipments: ShipmentLite[];
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
    shipments: ShipmentLite[];
    products: Product[];
    suppliers: SupplierLite[];
    customer_id?: string;
    shipment_id?: string;
    enums: SharedEnums;
    flash?: Flash;
}

export interface EditOrderProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
    customers: CustomerLite[];
    shipments: ShipmentLite[];
    products: Product[];
    suppliers: SupplierLite[];
    enums: SharedEnums;
    flash?: Flash;
}

export interface ShowOrderProps {
    filters: Filters;
    flash?: Flash;
    enums: SharedEnums;
    order: Order;
    orderItems: DataPagination<OrderItem>;
    products: Product[];
    customers: CustomerLite[];
    shipments: ShipmentLite[];
    suppliers: SupplierLite[];
    [key: string]: unknown;
}
