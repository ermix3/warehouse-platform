import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types/enums';
import { CheckCircle, ClipboardList, Package, ShoppingCart, TruckIcon, XCircle } from 'lucide-react';

export const OrderStatusIcons: Record<OrderStatus, React.FC<React.SVGProps<SVGSVGElement>>> = {
    [OrderStatus.DRAFT]: ClipboardList,
    [OrderStatus.PENDING]: ShoppingCart,
    [OrderStatus.CONFIRMED]: CheckCircle,
    [OrderStatus.SHIPPED]: TruckIcon,
    [OrderStatus.DELIVERED]: Package,
    [OrderStatus.CANCELLED]: XCircle,
};

export const getOrderStatusConfig = (status: string) => {
    switch (status) {
        case OrderStatus.DRAFT:
            return { color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200', Icon: OrderStatusIcons.draft };
        case OrderStatus.PENDING:
            return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200', Icon: OrderStatusIcons.pending };
        case OrderStatus.CONFIRMED:
            return { color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200', Icon: OrderStatusIcons.confirmed };
        case OrderStatus.SHIPPED:
            return { color: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200', Icon: OrderStatusIcons.shipped };
        case OrderStatus.DELIVERED:
            return { color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200', Icon: OrderStatusIcons.delivered };
        case OrderStatus.CANCELLED:
            return { color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200', Icon: OrderStatusIcons.cancelled };
        default:
            return { color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200', Icon: ClipboardList };
    }
};

export function OrderStatusBadge({ status }: Readonly<{ status: string }>) {
    const { color, Icon } = getOrderStatusConfig(status);

    return (
        <Badge className={`inline-flex items-center gap-1 ${color}`} variant="outline">
            <Icon className="h-3.5 w-3.5" />
            <span>
                {status
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
            </span>
        </Badge>
    );
}

/**
 * Helper function to get an appropriate color class based on the order status
 * Used for text, borders, and other UI elements
 */
export function getOrderStatusColor(status: string): string {
    switch (status) {
        case OrderStatus.DRAFT:
            return 'text-gray-600';
        case OrderStatus.PENDING:
            return 'text-yellow-600';
        case OrderStatus.CONFIRMED:
            return 'text-blue-600';
        case OrderStatus.SHIPPED:
            return 'text-indigo-600';
        case OrderStatus.DELIVERED:
            return 'text-green-600';
        case OrderStatus.CANCELLED:
            return 'text-red-600';
        default:
            return 'text-gray-600';
    }
}

/**
 * Helper function to determine if an order can be edited based on status
 */
export function canEditOrder(status: string): boolean {
    return [OrderStatus.DRAFT, OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(status as OrderStatus);
}

/**
 * Helper function to determine if an order can be cancelled based on status
 */
export function canCancelOrder(status: string): boolean {
    return [OrderStatus.DRAFT, OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(status as OrderStatus);
}
