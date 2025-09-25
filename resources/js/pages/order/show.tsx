import { ExportData } from '@/components/shared';
import MyTooltip from '@/components/shared/my-tooltip';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { OrderStatusBadge } from '@/lib/order-status-helper';
import { ShipmentStatusBadge } from '@/lib/shipment-status-helper';
import { getFormatedAmount } from '@/lib/utils';
import EditOrder from '@/pages/order/EditOrder';
import CreateProduct from '@/pages/product/CreateProduct';
import { dashboard } from '@/routes';
import { index, show } from '@/routes/orders';
import { exportData, show as showShipment } from '@/routes/shipments';
import { BreadcrumbItem, ShowOrderProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Info, TextSearch } from 'lucide-react';
import { useState } from 'react';

export default function ShowOrderPage({ order, orderItems, products, customers, shipments, suppliers, enums, flash }: Readonly<ShowOrderProps>) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showCreateProductDialog, setShowCreateProductDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Orders',
            href: index().url,
        },
        {
            title: order.order_number,
            href: show.url(order.id),
        },
        {
            title: 'Detail order',
            href: '',
        },
    ];

    return (
        <AppLayout flash={flash} breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id}`} />
            <div className="container mt-5 space-y-6 px-5">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Order Info */}
                    <Card>
                        <CardHeader className="border-b-1 border-b-gray-100">
                            <CardTitle>
                                Order Info <OrderStatusBadge status={order.status} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <b>Order Number:</b> {order.order_number}
                            </div>
                            <div>
                                <b>Total:</b> AED {Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <div>
                                <b>Created At:</b> {order.created_at ? new Date(order.created_at).toLocaleString() : '-'}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                        <CardHeader className="border-b-1 border-b-gray-100">
                            <CardTitle>Customer Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <b>Name:</b> {order?.customer?.name || '-'}
                            </div>
                            <div>
                                <b>Email:</b> {order?.customer?.email || '-'}
                            </div>
                            <div>
                                <b>Phone:</b> {order?.customer?.phone || '-'}
                            </div>
                            <div>
                                <b>Address:</b> {order?.customer?.address || '-'}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipment Info */}
                    <Card>
                        <CardHeader className="border-b-1 border-b-gray-100">
                            <CardTitle>
                                Shipment Info {order.shipment?.status ? <ShipmentStatusBadge status={order.shipment.status} /> : ''}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {order.shipment && (
                                <>
                                    <div>
                                        <b>Tracking #:</b> {order.shipment?.tracking_number ?? '-'}
                                    </div>
                                    <div>
                                        <b>Carrier:</b> {order.shipment?.carrier ?? '-'}
                                    </div>
                                    <div>
                                        <b>Created At:</b> {order.shipment?.created_at ? new Date(order.shipment.created_at).toLocaleString() : '-'}
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <MyTooltip title="Details">
                                            <Button
                                                size="icon"
                                                onClick={() => router.visit(showShipment.url(order.shipment!.id))}
                                                className={'hover:cursor-pointer'}
                                            >
                                                <TextSearch />
                                            </Button>
                                        </MyTooltip>

                                        <ExportData
                                            btnVariant={'outline'}
                                            btnSize={'icon'}
                                            onExport={(type) => {
                                                const q = { type };
                                                window.location.href = exportData.url({ shipment: order.shipment!.id }, { query: q });
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                            {!order.shipment && (
                                <div className="flex h-full w-full flex-col items-center justify-center">
                                    <Info className="h-10 w-10 text-muted-foreground" />
                                    <span>No shipment yet</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Attach Products Card */}
                <details className="mb-4 rounded border p-3" open>
                    <summary className="cursor-pointer font-medium">Attach Products</summary>
                    <div className="flex items-center justify-center gap-4">
                        <Button type="button" className="hover:cursor-pointer" onClick={() => setShowCreateProductDialog(true)}>
                            No product found
                        </Button>
                        <Button variant="outline" className="hover:cursor-pointer" onClick={() => setShowEditDialog(true)}>
                            Attach products
                        </Button>
                    </div>
                </details>

                {/* Order Items Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Box/QTY</TableHead>
                                        <TableHead>CTN</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                No items found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orderItems.data
                                            .toSorted((a, b) => a.id - b.id)
                                            .map(({ id, ctn, product }, index) => (
                                                <TableRow key={id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{product?.barcode + ' - ' + product?.name}</TableCell>
                                                    <TableCell>{product?.box_qtt || '-'}</TableCell>
                                                    <TableCell>{ctn}</TableCell>
                                                    <TableCell>{ctn * (product?.box_qtt || 0)}</TableCell>
                                                    <TableCell>{getFormatedAmount(product?.unit_price ?? 0)}</TableCell>
                                                    <TableCell>
                                                        {getFormatedAmount(Number(product?.unit_price) * (product?.box_qtt ?? 0) * (ctn || 0))}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination links={orderItems.links} from={orderItems.from} to={orderItems.to} total={orderItems.total} />
                    </CardContent>
                </Card>
            </div>

            {/* Edit current order */}
            <EditOrder
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                order={order}
                customers={customers}
                suppliers={suppliers}
                shipments={shipments}
                products={products}
                enums={enums}
            />

            {/*    Add product */}
            <CreateProduct open={showCreateProductDialog} onOpenChange={setShowCreateProductDialog} />
        </AppLayout>
    );
}
