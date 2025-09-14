/**
 * TypeScript definitions for backend PHP enums
 */

/**
 * Shipping Status enum that matches the backend ShippingStatus PHP enum
 */
export enum ShippingStatus {
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
 * Type for the formatted shipping status objects used in the UI
 */
export type FormattedShippingStatus = {
    name: keyof typeof ShippingStatus;
    value: ShippingStatus;
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
    shippingStatus: Record<keyof typeof ShippingStatus, FormattedShippingStatus>;
};
