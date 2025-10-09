/**
 * Shipment Status enum that matches the backend ShipmentStatus PHP enum
 */
export enum ShipmentStatusEnum {
    PENDING = 'pending',
    IN_TRANSIT = 'in_transit',
    DELIVERED = 'delivered',
    RETURNED = 'returned',
}
