import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { OrderStatusBadge } from '@/lib/order-status-helper';
import { dashboard } from '@/routes';
import { attachProduct, index, show } from '@/routes/orders';
import { BreadcrumbItem, ShowOrderProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ShowOrderPage({ order, customer, orderItems, products, flash }: ShowOrderProps) {
    const [showAttach, setShowAttach] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, setData, reset } = useForm({
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
        label: `${p.name}`,
        // stock: p.box_qtt * p.quantity_per_box,
    }));

    const selectedProduct = products.find((p) => p.id.toString() === data.product_id);

    const handleAttach = () => {
        if (!data.product_id || !data.ctn) {
            return;
        }

        setIsSubmitting(true);

        router.post(attachProduct(order.id), data, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowAttach(false);
            },
            onError: (errors) => {
                console.error(errors);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout flash={flash} breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.order_number}`} />
            <div className="container mt-5 space-y-6 px-5">
                {/* Order & Customer Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader className="justify-between">
                            <CardTitle>
                                Order Info <OrderStatusBadge status={order.status} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <b>Order Number:</b> {order.order_number}
                            </div>
                            <div>
                                <b>Total:</b> AED {Number(order.total)?.toFixed(2)}
                            </div>
                            <div>
                                <b>Created At:</b> {order.created_at ? new Date(order.created_at).toLocaleString() : '-'}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
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
                </div>

                {/* Attach Product Button */}
                {!showAttach && (
                    <div className="mb-2 flex justify-end">
                        <Button variant={showAttach ? 'default' : 'outline'} onClick={() => setShowAttach((v) => !v)} className="gap-2">
                            Attach Product
                        </Button>
                    </div>
                )}

                {/* Attach Product Card */}
                {showAttach && (
                    <Card className="mb-6 overflow-hidden border-primary/5 p-1">
                        <CardHeader className="relative rounded-xl bg-muted/80 p-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Add Product to Order</CardTitle>
                                <div>
                                    <Button
                                        variant="outline"
                                        className="mr-2"
                                        onClick={() => {
                                            setShowAttach(false);
                                            reset();
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAttach} disabled={!data.product_id || !data.ctn || isSubmitting}>
                                        {isSubmitting ? 'Adding...' : 'Add to Order'}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 pt-1">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="product">Product *</Label>
                                    <SearchableSelect
                                        id="product"
                                        options={productOptions}
                                        value={data.product_id}
                                        onValueChange={(value) => setData('product_id', value)}
                                        placeholder="Search and select product..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ctn">Cartons (CTN) *</Label>
                                    <div className="relative">
                                        <Input
                                            id="ctn"
                                            type="number"
                                            min={1}
                                            value={data.ctn}
                                            onChange={(e) => setData('ctn', parseInt(e.target.value) || 1)}
                                            className="pr-16"
                                        />
                                    </div>
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
                            </div>
                        </CardContent>
                    </Card>
                )}

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
                                        <TableHead>Box/Qtt</TableHead>
                                        <TableHead>CTN</TableHead>
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
                                        orderItems.data.map(({ id, ctn, product }) => (
                                            <TableRow key={id}>
                                                <TableCell>{id}</TableCell>
                                                <TableCell>{product?.name || 'Product #' + product?.id}</TableCell>
                                                <TableCell>{product?.box_qtt || '-'}</TableCell>
                                                <TableCell>{ctn}</TableCell>
                                                <TableCell>AED {Number(product?.unit_price)?.toFixed(2) ?? '-'}</TableCell>
                                                <TableCell>
                                                    AED {product ? (Number(product.unit_price) * product.box_qtt * ctn).toFixed(2) : '-'}
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
