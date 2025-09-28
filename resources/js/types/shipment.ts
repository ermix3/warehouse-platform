import { BaseEntity, DataPagination, SharedData, Timestamps } from '@/types';
import type { Customer } from './customer';
import { ShipmentStatus } from './enums';
import type { Order } from './order';
import type { Product } from './product';
import type { SupplierLite } from './supplier';

export interface ShipmentRequest {
    tracking_number: string;
    carrier: string;
    status: ShipmentStatus;
    notes: string;
}

export interface ShipmentLite extends Pick<BaseEntity, 'id'> {
    tracking_number: string | null;
    carrier: string | null;
    status: ShipmentStatus;
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

interface ShowShipmentFilters {
    orders_search?: string;
    customers_search?: string;
}

export interface ShowShipmentProps extends Pick<SharedData, 'flash'> {
    shipment: Shipment;
    orders: DataPagination<Order>;
    customers: DataPagination<Pick<Customer, 'id' | 'code' | 'name' | 'phone'>>;
    allCustomers: Customer[];
    shipments: ShipmentLite[];
    products: Product[];
    suppliers: SupplierLite[];
    filters: ShowShipmentFilters;
    [key: string]: unknown;
}
