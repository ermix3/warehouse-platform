import { Badge } from '@/components/ui/badge';
import { ShippingStatus } from '@/types/enums';
import { Clock, PackageCheck, PackageX, Truck } from 'lucide-react';

export const ShippingStatusIcons: Record<ShippingStatus, React.FC<React.SVGProps<SVGSVGElement>>> = {
    [ShippingStatus.PENDING]: Clock,
    [ShippingStatus.INTRANSIT]: Truck,
    [ShippingStatus.DELIVERED]: PackageCheck,
    [ShippingStatus.RETURNED]: PackageX,
};

export const getShippingStatusConfig = (status: string) => {
    switch (status) {
        case ShippingStatus.PENDING:
            return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200', Icon: ShippingStatusIcons.pending };
        case ShippingStatus.INTRANSIT:
            return { color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200', Icon: ShippingStatusIcons.in_transit };
        case ShippingStatus.DELIVERED:
            return { color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200', Icon: ShippingStatusIcons.delivered };
        case ShippingStatus.RETURNED:
            return { color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200', Icon: ShippingStatusIcons.returned };
        default:
            return { color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200', Icon: Clock };
    }
};

export function ShippingStatusBadge({ status }: Readonly<{ status: string }>) {
    const { color, Icon } = getShippingStatusConfig(status);

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
