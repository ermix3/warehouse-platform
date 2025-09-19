/**
 * TypeScript definitions for backend PHP enums
 */

/**
 * Shipment Status enum that matches the backend ShipmentStatus PHP enum
 */
export enum ShipmentStatus {
    PENDING = 'pending',
    INTRANSIT = 'in_transit',
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
};
