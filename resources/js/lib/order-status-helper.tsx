import { Badge } from '@/components/ui/badge';
import { OrderStatusEnum } from '@/enums';
import { CheckCircle, ClipboardList, Package, ShoppingCart, TruckIcon, XCircle } from 'lucide-react';

export const OrderStatusIcons: Record<OrderStatusEnum, React.FC<React.SVGProps<SVGSVGElement>>> = {
    [OrderStatusEnum.DRAFT]: ClipboardList,
    [OrderStatusEnum.PENDING]: ShoppingCart,
    [OrderStatusEnum.CONFIRMED]: CheckCircle,
    [OrderStatusEnum.SHIPPED]: TruckIcon,
    [OrderStatusEnum.DELIVERED]: Package,
    [OrderStatusEnum.CANCELLED]: XCircle,
};

export const getOrderStatusConfig = (status: string) => {
    switch (status) {
        case OrderStatusEnum.DRAFT:
            return { color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200', Icon: OrderStatusIcons.draft };
        case OrderStatusEnum.PENDING:
            return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200', Icon: OrderStatusIcons.pending };
        case OrderStatusEnum.CONFIRMED:
            return { color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200', Icon: OrderStatusIcons.confirmed };
        case OrderStatusEnum.SHIPPED:
            return { color: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200', Icon: OrderStatusIcons.shipped };
        case OrderStatusEnum.DELIVERED:
            return { color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200', Icon: OrderStatusIcons.delivered };
        case OrderStatusEnum.CANCELLED:
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
