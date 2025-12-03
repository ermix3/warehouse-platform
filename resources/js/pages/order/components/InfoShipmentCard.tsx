import { ExportData } from '@/components/shared';
import MyTooltip from '@/components/shared/my-tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentStatusBadge } from '@/lib/shipment-status-helper';
import { exportData, show as showShipment } from '@/routes/shipments';
import { InfoShipmentCardProps } from '@/types';
import { router } from '@inertiajs/react';
import { Ship, TextSearch } from 'lucide-react';

export function InfoShipmentCard({ order, canExportShipments, canViewShipments }: Readonly<InfoShipmentCardProps>) {
    if (!order.shipment) {
        return (
            <Card className="pt-3">
                <CardHeader className="flex flex-row items-center justify-between border-b-2 pb-2">
                    <CardTitle className="text-md">Shipment Info</CardTitle>
                </CardHeader>
                <CardContent className="mt-4 flex h-full w-full flex-col items-center justify-center space-y-2 text-center text-muted-foreground">
                    <Ship size="50" className="mb-6 text-ring" />
                    <p>No shipment information available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="pt-3">
            <CardHeader className="flex flex-row items-center justify-between border-b-2 pb-2">
                <CardTitle className="text-lg">Shipment Info</CardTitle>
                <ShipmentStatusBadge status={order.shipment.status} />
            </CardHeader>
            <CardContent className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Tracking #:</div>
                    <div className="text-sm text-muted-foreground">{order.shipment.tracking_number || '-'}</div>

                    <div className="text-sm font-medium">Carrier:</div>
                    <div className="text-sm text-muted-foreground">{order.shipment.carrier || '-'}</div>

                    <div className="text-sm font-medium">Created At:</div>
                    <div className="text-sm text-muted-foreground">
                        {order.shipment.created_at ? new Date(order.shipment.created_at).toLocaleString() : '-'}
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    {canViewShipments && (
                        <MyTooltip title="View Shipment">
                            <Button
                                variant="outline"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() => router.visit(showShipment.url(order.shipment!.id))}
                            >
                                <TextSearch className="h-4 w-4" />
                            </Button>
                        </MyTooltip>
                    )}
                    {canExportShipments && (
                        <ExportData
                            btnSize="icon"
                            onExport={(format, extra) => {
                                const q = { format, ...extra };
                                window.location.href = exportData.url({ shipment: order.shipment!.id }, { query: q });
                            }}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
