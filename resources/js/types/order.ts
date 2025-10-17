import { OrderStatusEnum } from '@/enums';
import {
    BaseEntity,
    Customer,
    CustomerLite,
    DataPagination,
    OrderItemLite,
    OrderItemRequest,
    OrderItemUpdate,
    ProductLite,
    SelectOption,
    SharedData,
    Shipment,
    ShipmentLite,
    SupplierLite,
    Timestamps,
} from '@/types';

export interface OrderRequest {
    order_number: string;
    status: OrderStatusEnum;
    total: number;
    customer_id: string;
    shipment_id: string;
    supplier_id: string;
    order_items: OrderItemRequest[];
}

export interface OrderLite extends Pick<BaseEntity, 'id'> {
    order_number: string;
    status: OrderStatusEnum;
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
    setSelectedCustomerId?: (id: string) => void;
}

export interface ShowOrderProps extends Pick<SharedData, 'flash'>, RelatedItems {
    orderItems: DataPagination<OrderItemUpdate>;
    order: Order;
}

// Show order page
export interface InfoShipmentCardProps extends Pick<ShowOrderProps, 'order'> {
    canExportShipments: boolean;
    canViewShipments: boolean;
}

export interface AttachProductSectionProps {
    orderId: number;
    productOptions: SelectOption[];
    onOpenCreateProduct: () => void;
    canAddProduct: boolean;
}

export interface OrderItemsTableProps extends Pick<ShowOrderProps, 'orderItems' | 'order'> {
    canEditOrder: boolean;
}
