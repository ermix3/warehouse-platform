import { OrderStatusEnum, ShipmentStatusEnum } from '@/enums';
import { CustomerLite, Permission, ProductLite, RoleLite, SelectOption, ShipmentLite, SupplierLite } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const randomColorUtility = (length: number) => {
    return Math.floor(Math.random() * length);
};

export const getRandomHexColor = () => {
    const hex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
    const length = hex.length;
    let hexColor = '#';
    for (let i = 0; i < 6; i++) {
        hexColor += hex[randomColorUtility(length)];
    }
    return hexColor;
};

/**
 * Formats a number as a currency string in AED with custom decimal places.
 *
 * @param amount - The numeric amount to format.
 * @param min - Minimum number of decimal places (default: 2).
 * @param max - Maximum number of decimal places (default: 2).
 * @returns Formatted string, e.g. "AED 1,234.56"
 */
export const getFormattedAmount = (amount: number, min: number = 2, max: number = 2) => {
    if (!amount) return 'AED 0.00';
    return `AED ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: min, maximumFractionDigits: max })}`;
};

export const shipmentStatusOptions: SelectOption<ShipmentStatusEnum>[] = Object.values(ShipmentStatusEnum).map((status) => ({
    value: status,
    label: status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
}));

export const orderStatusOptions: SelectOption<OrderStatusEnum>[] = Object.values(OrderStatusEnum).map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace('_', ' '),
}));

export const getPermissionsOptions = (permissions: Permission[]) =>
    permissions.map((p) => ({
        label: p.name.replaceAll('_', ' '),
        value: p.name,
    }));

export const getRolesOptions = (roles: RoleLite[]) =>
    roles.map((p) => ({
        label: p.name.replaceAll('_', ' '),
        value: p.name,
    }));

export const getProductOptions = (products: ProductLite[]) =>
    products.map((product) => ({
        value: product.id.toString(),
        label: `${product.barcode} - ${product.name}`,
    }));

export const getCustomerOptions = (customers: CustomerLite[]) =>
    customers.map((customer) => ({
        value: customer.id.toString(),
        label: customer.name,
    }));

export const getShipmentOptions = (shipments: ShipmentLite[]) =>
    shipments.map((shipment) => ({
        value: shipment.id.toString(),
        label: shipment.tracking_number ? `${shipment.tracking_number} (${shipment.carrier})` : `Shipment #${shipment.id}`,
    }));

export const getSupplierOptions = (suppliers: SupplierLite[]) =>
    suppliers.map((supplier) => ({
        value: supplier.id.toString(),
        label: supplier.name,
    }));
