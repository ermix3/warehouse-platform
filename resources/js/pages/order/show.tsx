import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { OrderStatusBadge } from '@/lib/order-status-helper';
import { ShippingStatusBadge } from '@/lib/shipping-status-helper';
import { dashboard } from '@/routes';
import { attachProduct, index, show } from '@/routes/orders';
import { show as showShipping } from '@/routes/shippings';
import { BreadcrumbItem, ShowOrderProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Info, TextSearch } from 'lucide-react';

export default function ShowOrderPage({ order, customer, orderItems, products, flash }: Readonly<ShowOrderProps>) {
    const { data, setData, post, processing, errors, reset, isDirty } = useForm({
        product_id: '',
        ctn: 1,
    });

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

    const productOptions = products.map((p) => ({
        value: p.id.toString(),
        label: `${p.barcode} - ${p.name}`,
    }));

    const selectedProduct = products.find((p) => p.id.toString() === data.product_id);

    const handleAttach = (e: React.FormEvent) => {
        e.preventDefault();
        post(attachProduct(order.id).url, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout flash={flash} breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.order_number}`} />
            <div className="container mt-5 space-y-6 px-5">
                {/* Order & Customer Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                    <Card>
                        <CardHeader className="border-b-1 border-b-gray-100">
                            <CardTitle>Customer Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <b>Name:</b> {customer.name}
                            </div>
                            <div>
                                <b>Email:</b> {customer.email || '-'}
                            </div>
                            <div>
                                <b>Phone:</b> {customer.phone || '-'}
                            </div>
                            <div>
                                <b>Address:</b> {customer.address || '-'}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipment Info (if exists) */}
                    <Card>
                        <CardHeader className="border-b-1 border-b-gray-100">
                            <CardTitle>
                                Shipment Info {order.shipping?.status ? <ShippingStatusBadge status={order.shipping.status} /> : ''}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {order.shipping && (
                                <>
                                    <div>
                                        <b>Tracking #:</b> {order.shipping?.tracking_number ?? '-'}
                                    </div>
                                    <div>
                                        <b>Carrier:</b> {order.shipping?.carrier ?? '-'}
                                    </div>
                                    <div>
                                        <b>Created At:</b> {order.shipping?.created_at ? new Date(order.shipping.created_at).toLocaleString() : '-'}
                                    </div>
                                    <div className="pt-2">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => router.visit(showShipping.url(order.shipping!.id))}
                                            className={'hover:cursor-pointer'}
                                        >
                                            Details <TextSearch />
                                        </Button>
                                    </div>
                                </>
                            )}
                            {!order.shipping && (
                                <div className="flex h-full w-full flex-col items-center justify-center">
                                    <Info className="h-10 w-10 text-muted-foreground" />
                                    <span>No shipment yet</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Attach Product Card */}
                <div className="mb-4">
                    <details className="rounded border p-3">
                        <summary className="cursor-pointer font-medium">Add Product to Order</summary>
                        <form onSubmit={handleAttach} className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
                            <div>
                                <Label htmlFor="product">Product *</Label>
                                <SearchableSelect
                                    options={productOptions}
                                    value={data.product_id}
                                    onValueChange={(value) => setData('product_id', value)}
                                    placeholder="Search and select product..."
                                />
                                {errors.product_id && <div className="mt-1 text-sm text-red-500">{errors.product_id}</div>}
                            </div>
                            <div>
                                <Label htmlFor="ctn">Cartons (CTN) *</Label>
                                <Input
                                    id="ctn"
                                    type="number"
                                    min={1}
                                    value={data.ctn}
                                    onChange={(e) => setData('ctn', parseInt(e.target.value) || 1)}
                                    className="pr-16"
                                />
                                {errors.ctn && <div className="mt-1 text-sm text-red-500">{errors.ctn}</div>}
                            </div>
                            {selectedProduct && (
                                <div className="space-y-2">
                                    <Label>Details</Label>
                                    <div className="rounded-md border p-3 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-muted-foreground">Box Qty:</span>
                                            <span>{selectedProduct.box_qtt || '-'}</span>
                                            <span className="text-muted-foreground">Unit Price:</span>
                                            <span>AED {Number(selectedProduct.unit_price)?.toFixed(2)}</span>
                                            <span className="text-muted-foreground">Total:</span>
                                            <span className="font-medium">
                                                AED {(selectedProduct.unit_price * selectedProduct.box_qtt * (data.ctn || 0)).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-end space-x-2">
                                <Button type="submit" disabled={processing || !isDirty}>
                                    {processing ? 'Creating...' : 'Attach'}
                                </Button>
                                {isDirty && (
                                    <Button type="button" variant="outline" onClick={() => reset()} disabled={processing}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </details>
                </div>

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
                                                    <TableCell>
                                                        AED{' '}
                                                        {Number(product?.unit_price)?.toLocaleString('en-US', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }) ?? '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        AED{' '}
                                                        {product
                                                            ? (Number(product.unit_price) * product.box_qtt * ctn).toLocaleString('en-US', {
                                                                  minimumFractionDigits: 2,
                                                                  maximumFractionDigits: 2,
                                                              })
                                                            : '-'}
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
        </AppLayout>
    );
}
