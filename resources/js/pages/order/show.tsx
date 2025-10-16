import { DeleteItem, ExportData } from '@/components/shared';
import MyTooltip from '@/components/shared/my-tooltip';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionsEnum, ResourcesEnum } from '@/enums';
import { usePermission } from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import { OrderStatusBadge } from '@/lib/order-status-helper';
import { ShipmentStatusBadge } from '@/lib/shipment-status-helper';
import { getFormattedAmount } from '@/lib/utils';
import CreateProduct from '@/pages/product/CreateProduct';
import { dashboard } from '@/routes';
import { attachProduct, detachProduct, index, show } from '@/routes/orders';
import { exportData, show as showShipment } from '@/routes/shipments';
import { BreadcrumbItem, OrderItemLite, SelectOption, ShowOrderProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Asterisk, Info, Pencil, TextSearch, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function ShowOrder({ order, orderItems, products, flash }: Readonly<ShowOrderProps>) {
    const [showCreateProductDialog, setShowCreateProductDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteOrderItem, setDeleteOrderItem] = useState<OrderItemLite | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingItem, setEditingItem] = useState<{ id: number | null; field: string; originalValue?: string }>({ id: null, field: '' });
    const [editValue, setEditValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, isDirty } = useForm({
        product_id: '',
        ctn: 1,
    });

    // Focus the input when editing starts
    useEffect(() => {
        if (editingItem.id && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingItem]);

    const handleStartEdit = (item: OrderItemLite, field: string, value: string | number) => {
        setEditingItem({ id: item.id, field, originalValue: String(value) });
        setEditValue(String(value));
    };

    const handleSaveEdit = async (item: OrderItemLite) => {
        // Don't save if value hasn't changed or is invalid
        if (editingItem.originalValue === editValue || !editValue.trim()) {
            setEditingItem({ id: null, field: '' });
            return;
        }

        try {
            // Only CTN is editable for now
            if (editingItem.field === 'ctn') {
                await router.patch(`/orders/${order.id}/order-items/${item.id}`, { ctn: parseInt(editValue) || 1 }, { preserveScroll: true });
                setEditingItem({ id: null, field: '' });
            }
        } catch (error) {
            console.error('Failed to update order item:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, item: OrderItemLite) => {
        if (e.key === 'Enter') {
            handleSaveEdit(item);
        } else if (e.key === 'Escape') {
            setEditingItem({ id: null, field: '' });
        }
    };

    const productOptions: SelectOption[] = products.map((p) => ({ value: p.id.toString(), label: `${p.barcode} - ${p.name}` }));

    const handleAttach = (e: React.FormEvent) => {
        e.preventDefault();
        post(attachProduct.url(order.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleDelete = () => {
        if (!deleteOrderItem) return;

        setIsDeleting(true);
        router.delete(detachProduct.url({ order: order.id, orderItem: deleteOrderItem.id }), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeleteOrderItem(null);
            },
            onError: (error) => {
                console.error('Failed to detach product: ', error);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const openDeleteDialog = (orderItem: OrderItemLite) => {
        setDeleteOrderItem(orderItem);
        setShowDeleteDialog(true);
    };

    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false);
            setDeleteOrderItem(null);
        }
    };

    const getOrderSum = (orderItems: OrderItemLite[]) => {
        return orderItems.reduce((sum, item) => sum + item.ctn, 0);
    };

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

    //##############//#####################//#############
    //##############// Handle Permissions //#############
    //#############//####################//#############
    const { hasPermission } = usePermission();
    const canAddProduct = hasPermission(ActionsEnum.CREATE, ResourcesEnum.PRODUCTS);
    const canExportShipments = hasPermission(ActionsEnum.EXPORT, ResourcesEnum.SHIPMENTS);
    const canViewShipments = hasPermission(ActionsEnum.VIEW, ResourcesEnum.SHIPMENTS);

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
                                <b>Total:</b> {getFormattedAmount(order.total)}
                            </div>
                            <div>
                                <b>Total CTN:</b> {getOrderSum(order.items)}
                            </div>
                            <div>
                                <b>Supplier:</b> {order.supplier?.name || '-'}
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
                                    {(canViewShipments || canExportShipments) && (
                                        <div className="flex justify-end gap-2 pt-2">
                                            {canViewShipments && (
                                                <MyTooltip title="Details">
                                                    <Button
                                                        size="icon"
                                                        onClick={() => router.visit(showShipment.url(order.shipment!.id))}
                                                        className={'hover:cursor-pointer'}
                                                    >
                                                        <TextSearch />
                                                    </Button>
                                                </MyTooltip>
                                            )}

                                            {canExportShipments && (
                                                <ExportData
                                                    btnVariant={'outline'}
                                                    btnSize={'icon'}
                                                    onExport={(type) => {
                                                        const q = { type };
                                                        window.location.href = exportData.url({ shipment: order.shipment!.id }, { query: q });
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}
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

                {/* Attach Product Card */}
                <div className="mb-4">
                    <details className="rounded border p-3" open>
                        <summary className="cursor-pointer font-medium">Attach Product</summary>
                        <form onSubmit={handleAttach} className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-12">
                            <div className="md:col-span-8">
                                <Label htmlFor="product">
                                    Product <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                                </Label>
                                <SearchableSelect
                                    options={productOptions}
                                    value={data.product_id}
                                    onValueChange={(value) => setData('product_id', value)}
                                    placeholder="Search and select product..."
                                />
                                {errors.product_id && <div className="mt-1 text-sm text-red-500">{errors.product_id}</div>}
                            </div>
                            <div className="md:col-span-1">
                                <Label htmlFor="ctn">
                                    CTN
                                    <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                                </Label>
                                <Input
                                    id="ctn"
                                    type="number"
                                    min={1}
                                    value={data.ctn}
                                    onChange={(e) => setData('ctn', Number.parseInt(e.target.value) || 1)}
                                    className=""
                                />
                                {errors.ctn && <div className="mt-1 text-sm text-red-500">{errors.ctn}</div>}
                            </div>
                            <div className="flex items-end space-x-2 md:col-span-3">
                                <Button type="submit" className="hover:cursor-pointer" disabled={processing || !isDirty}>
                                    {processing ? 'Creating...' : 'Attach'}
                                </Button>
                                {isDirty && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="hover:cursor-pointer"
                                        onClick={() => reset()}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                )}
                                {!isDirty && canAddProduct && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="ring-1 ring-gray-300 ring-inset hover:cursor-pointer hover:ring-gray-400"
                                        onClick={() => setShowCreateProductDialog(true)}
                                    >
                                        No product found
                                    </Button>
                                )}
                            </div>
                        </form>
                    </details>
                </div>

                {/* Order Items Table */}
                <Card>
                    <CardHeader className="border-b-1 border-b-gray-100">
                        <CardTitle>Order Items</CardTitle>
                        <CardDescription className="mb-1 w-fit rounded-xl bg-orange-100 px-2 py-1 text-sm text-black">
                            <Info size={18} className={'mr-2 inline-flex text-orange-500'} />
                            The columns with <Asterisk color={'blue'} size={12} className={'inline-flex align-super'} /> mean's they are editable
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Box/QTY</TableHead>
                                        <TableHead>
                                            CTN <Asterisk color={'blue'} size={12} className={'inline-flex align-super'} />
                                        </TableHead>
                                        <TableHead>Sum</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Action</TableHead>
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
                                                    <TableCell>{`${order.customer.code}-${order?.supplier?.code}-${order.order_number}-${index + 1}`}</TableCell>
                                                    <TableCell>{product.barcode + ' - ' + product.name}</TableCell>
                                                    <TableCell>{product.box_qtt || '-'}</TableCell>
                                                    <TableCell>
                                                        {editingItem.id === id && editingItem.field === 'ctn' ? (
                                                            <Input
                                                                ref={inputRef}
                                                                type="number"
                                                                min="1"
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                onBlur={() => handleSaveEdit({ id, ctn, product })}
                                                                onKeyDown={(e) => handleKeyDown(e, { id, ctn, product })}
                                                                className="h-8 w-20"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="group relative min-w-[60px] cursor-pointer rounded-md border border-transparent p-1.5 text-center transition-all hover:border-blue-200 hover:bg-blue-50"
                                                                onClick={() => handleStartEdit({ id, ctn, product }, 'ctn', ctn)}
                                                            >
                                                                <span className="flex items-center justify-between">
                                                                    <span className="flex-1">{ctn}</span>
                                                                    <span className="invisible ml-1 text-blue-500 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                                                                        <Pencil className="h-4 w-4" />
                                                                    </span>
                                                                </span>
                                                                <span className="absolute right-0 -bottom-1 left-0 mx-auto h-0.5 w-0 bg-blue-400 transition-all duration-200 group-hover:w-4/5"></span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{ctn * (product.box_qtt || 0)}</TableCell>
                                                    <TableCell>{getFormattedAmount(product.unit_price ?? 0)}</TableCell>
                                                    <TableCell>
                                                        {getFormattedAmount(Number(product.unit_price) * (product.box_qtt ?? 0) * (ctn || 0))}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="hover:cursor-pointer"
                                                            onClick={() => openDeleteDialog({ id, ctn, product })}
                                                        >
                                                            <Trash2 color={'white'} />
                                                        </Button>
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

            {/* Add product */}
            <CreateProduct open={showCreateProductDialog} onOpenChange={setShowCreateProductDialog} />

            {/* Delete OrderItem */}
            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Detach Product"
                itemName={deleteOrderItem?.product.barcode + ' - ' + deleteOrderItem?.product.name}
                description="Are you sure you want to detach product? This action cannot be undone."
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
