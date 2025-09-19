import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const randomColorUtility = (length: number) => {
    return Math.floor(Math.random() * length);
};

export const hexy = () => {
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
export const getFormatedAmount = (amount: number, min: number = 2, max: number = 2) => {
    if (!amount) return 'AED 0.00';
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: min, maximumFractionDigits: max })}`;
};
