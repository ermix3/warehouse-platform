/**
 * TypeScript definitions for backend PHP enums
 */

/**
 * Roles enum that matches the backend RolesEnum PHP enum
 */
export enum RolesEnum {
    ADMIN = 'admin',
    STAFF = 'staff',
    INVOICE_OFFICE = 'invoice-office',
    ACCOUNTANT = 'accountant',
    CUSTOMER = 'customer',
}

/**
 * Type for the formatted role objects used in the UI
 */
export interface FormattedRole {
    name: keyof typeof RolesEnum;
    value: RolesEnum;
    label: string;
}

/**
 * Shipment Status enum that matches the backend ShipmentStatus PHP enum
 */
export enum ShipmentStatus {
    PENDING = 'pending',
    IN_TRANSIT = 'in_transit',
    DELIVERED = 'delivered',
    RETURNED = 'returned',
}

/**
 * Order Status enum that matches the backend OrderStatus PHP enum
 */
export enum OrderStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

/**
 * Type for the formatted shipment status objects used in the UI
 */
export type FormattedShipmentStatus = {
    name: keyof typeof ShipmentStatus;
    value: ShipmentStatus;
    label: string;
};

/**
 * Type for the formatted order status objects used in the UI
 */
export type FormattedOrderStatus = {
    name: keyof typeof OrderStatus;
    value: OrderStatus;
    label: string;
};

/**
 * Type for the shared enum values from Inertia props
 */
export type SharedEnums = {
    orderStatus: Record<keyof typeof OrderStatus, FormattedOrderStatus>;
    shipmentStatus: Record<keyof typeof ShipmentStatus, FormattedShipmentStatus>;
    roles: Record<keyof typeof RolesEnum, FormattedRole>;
};
