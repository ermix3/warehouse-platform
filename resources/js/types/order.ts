import {
    BaseEntity,
    Customer,
    CustomerLite,
    DataPagination,
    OrderItem,
    OrderItemLite,
    OrderItemRequest,
    ProductLite,
    SharedData,
    Shipment,
    ShipmentLite,
    SupplierLite,
    Timestamps,
} from '@/types';
import { OrderStatus } from './enums';

export interface OrderRequest {
    order_number: string;
    status: OrderStatus;
    total: number;
    customer_id: string;
    shipment_id: string;
    supplier_id: string;
    order_items: OrderItemRequest[];
}

export interface OrderLite extends Pick<BaseEntity, 'id'> {
    order_number: string;
    status: OrderStatus;
    total: number;
}

export interface Order extends OrderLite, Timestamps {
    customer: Customer;
    shipment?: Shipment;
    supplier?: SupplierLite;
    items: OrderItemLite[];
    items_count?: number;
}

export interface RelatedItems {
    customers: CustomerLite[];
    shipments: ShipmentLite[];
    suppliers: SupplierLite[];
    products: ProductLite[];
}

export interface PageOrderProps extends SharedData, RelatedItems {
    orders: DataPagination<Order>;
}

export interface EditOrderProps extends RelatedItems {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface CreateOrderProps extends Omit<EditOrderProps, 'order'> {
    customer_id?: string;
    shipment_id?: string;
}

export interface ShowOrderProps extends Pick<SharedData, 'flash'>, RelatedItems {
    orderItems: DataPagination<OrderItem>;
    order: Order;
}
