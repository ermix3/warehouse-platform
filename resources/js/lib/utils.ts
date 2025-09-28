import { SelectOption } from '@/types';
import { OrderStatus, ShipmentStatus } from '@/types/enums';
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

export const shipmentStatusOptions: SelectOption<ShipmentStatus>[] = Object.values(ShipmentStatus).map((status) => ({
    value: status,
    label: status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
}));

export const orderStatusOptions: SelectOption<OrderStatus>[] = Object.values(OrderStatus).map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace('_', ' '),
}));
