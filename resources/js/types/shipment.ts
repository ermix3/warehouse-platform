import { type Customer, DataPagination, type Filters, Flash, Order, Product, SharedEnums, SupplierLite } from '@/types';

export interface ShipmentLite {
    id: number;
    tracking_number?: string;
    carrier?: string;
}

export interface Shipment {
    id: number;
    tracking_number?: string;
    carrier?: string;
    status: string;
    total: number;
    notes?: string;
    orders_count: number;
    created_at?: string;
    updated_at?: string;
}

export interface PageShipmentProps {
    shipments: DataPagination<Shipment>;
    filters: Filters;
    flash?: Flash;
    enums: SharedEnums;
    [key: string]: unknown;
}

export interface CreateShipmentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditShipmentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shipment: Shipment | null;
}

interface ShowShipmentFilters {
    orders_search?: string;
    customers_search?: string;
}

export interface ShowShipmentProps {
    shipment: Shipment;
    orders: DataPagination<Order>;
    customers: DataPagination<Pick<Customer, 'id' | 'code' | 'name' | 'phone'>>;
    allCustomers: Array<Pick<Customer, 'id' | 'code' | 'name'>>;
    shipments: ShipmentLite[];
    products: Product[];
    suppliers: SupplierLite[];
    filters: ShowShipmentFilters;
    flash?: Flash;
    enums: SharedEnums;
    [key: string]: unknown;
}
