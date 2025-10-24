import { ShipmentStatusEnum } from '@/enums';
import { BaseEntity, DataPagination, SelectOption, SharedData, Timestamps } from '@/types';
import type { Customer } from './customer';
import type { Order } from './order';
import type { SupplierLite } from './supplier';

export interface ShipmentRequest {
    tracking_number: string;
    carrier: string;
    status: ShipmentStatusEnum;
    notes: string;
}

export interface ShipmentLite extends Pick<BaseEntity, 'id'> {
    tracking_number: string | null;
    carrier: string | null;
    status: ShipmentStatusEnum;
}

export interface Shipment extends ShipmentLite, Timestamps {
    notes: string | null;
    total: number;
    orders?: Order[];
    customer?: Customer;
    orders_count: number;
}

export interface PageShipmentProps extends SharedData {
    shipments: DataPagination<Shipment>;
}

export interface CreateShipmentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditShipmentProps extends CreateShipmentProps {
    shipment: Shipment | null;
}

export interface ShowShipmentProps extends Pick<SharedData, 'flash'> {
    shipment: Shipment;
    orders: DataPagination<Order>;
    customers: DataPagination<Pick<Customer, 'id' | 'code' | 'name' | 'phone' | 'address'>>;
    allCustomers: Customer[];
    shipments: ShipmentLite[];
    suppliers: SupplierLite[];
    [key: string]: unknown;
}

// Show Page Props
export interface ShipmentInfoCardProps extends Pick<ShowShipmentProps, 'shipment'> {
    canEditShipments: boolean;
    canExportShipments: boolean;
    onEditClick: () => void;
}

export interface AttachCustomerSectionProps {
    canAddOrder: boolean;
    canAddCustomer: boolean;
    customerOptions: SelectOption[];
    selectedCustomerId: string;
    onCustomerSelect: (id: string) => void;
    onOpenCreateOrder: (customerId: string) => void;
    onOpenCreateCustomer: () => void;
}

export interface CustomersTableProps extends Pick<ShowShipmentProps, 'customers'> {
    canAddOrder: boolean;
    onCreateOrder: (customerId: string) => void;
}

export interface OrdersTableProps extends Pick<ShowShipmentProps, 'orders'> {
    canViewOrder: boolean;
    canDeleteOrder: boolean;
    onViewOrder: (orderId: number) => void;
    onDeleteOrder: (order: Order) => void;
}
