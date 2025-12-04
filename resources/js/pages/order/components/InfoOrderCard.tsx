import { ExportData } from '@/components/shared';
import MyTooltip from '@/components/shared/my-tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusBadge } from '@/lib/order-status-helper';
import { getFormattedAmount } from '@/lib/utils';
import EditOrder from '@/pages/order/EditOrder';
import { exportData } from '@/routes/orders';
import { CustomerLite, Order, OrderItemLite, ShipmentLite, SupplierLite } from '@/types';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

type InfoOrderCardProps = { order: Order; customers: CustomerLite[]; suppliers: SupplierLite[]; shipments: ShipmentLite[] };

export function InfoOrderCard({ order, customers, suppliers, shipments }: Readonly<InfoOrderCardProps>) {
    const [showEditDialog, setShowEditDialog] = useState(false);

    const getOrderSum = (items: OrderItemLite[]) => {
        return items.reduce((sum, item) => sum + item.ctn, 0);
    };

    const canEditOrder = true;
    const canExportOrder = true;

    return (
        <>
            <Card className="pt-3">
                <CardHeader className="flex flex-row items-center justify-between border-b-2 pb-2">
                    <CardTitle className="text-lg gap-2">
                        Order Info
                    <OrderStatusBadge status={order.status} />
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {canEditOrder && (
                            <MyTooltip title="Edit shipment">
                                <Button variant="ghost" size="icon" className="ml-1 hover:cursor-pointer" onClick={() => setShowEditDialog(true)}>
                                    <Pencil className="mt-1 h-4 w-4" />
                                </Button>
                            </MyTooltip>
                        )}
                        {canExportOrder && (
                            <ExportData
                                btnSize="icon"
                                onExport={(format, extra) => {
                                    const q = { format, ...extra };
                                    window.location.href = exportData.url({ order: order.id }, { query: q });
                                }}
                            />
                        )}
                    </div>
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

            <EditOrder
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                order={order}
                customers={customers}
                suppliers={suppliers}
                shipments={shipments}
            />
        </>
    );
}
