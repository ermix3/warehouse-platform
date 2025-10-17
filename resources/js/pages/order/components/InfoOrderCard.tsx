import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusBadge } from '@/lib/order-status-helper';
import { getFormattedAmount } from '@/lib/utils';
import { Order, OrderItemLite } from '@/types';

export function InfoOrderCard({ order }: Readonly<{ order: Order }>) {
    const getOrderSum = (items: OrderItemLite[]) => {
        return items.reduce((sum, item) => sum + item.ctn, 0);
    };

    return (
        <Card className="pt-3">
            <CardHeader className="flex flex-row items-center justify-between border-b-2 pb-2">
                <CardTitle className="text-lg">Order Info</CardTitle>
                <OrderStatusBadge status={order.status} />
            </CardHeader>
            <CardContent className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Order Number:</div>
                    <div className="text-sm text-muted-foreground">{order.order_number}</div>

                    <div className="text-sm font-medium">Total:</div>
                    <div className="text-sm text-muted-foreground">{getFormattedAmount(order.total)}</div>

                    <div className="text-sm font-medium">Total CTN:</div>
                    <div className="text-sm text-muted-foreground">{getOrderSum(order.items || [])}</div>

                    <div className="text-sm font-medium">Supplier:</div>
                    <div className="text-sm text-muted-foreground">{order.supplier?.name || '-'}</div>

                    <div className="text-sm font-medium">Created At:</div>
                    <div className="text-sm text-muted-foreground">{order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</div>
                </div>
            </CardContent>
        </Card>
    );
}
