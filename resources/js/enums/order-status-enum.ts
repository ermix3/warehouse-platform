/**
 * Order Status enum that matches the backend OrderStatus PHP enum
 */
export enum OrderStatusEnum {
    DRAFT = 'draft',
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}
