import { MyDivider } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatusIcons } from '@/lib/order-status-helper';
import { orderStatusOptions } from '@/lib/utils';
import { update } from '@/routes/orders';
import { EditOrderProps, OrderItemRequest, OrderRequest, SelectOption } from '@/types';
import { OrderStatus } from '@/types/enums';
import { useForm } from '@inertiajs/react';
import { Asterisk, CirclePlus, Clock, Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function EditOrder({ open, onOpenChange, order, customers, shipments, products, suppliers }: Readonly<EditOrderProps>) {
    const { data, setData, setError, put, reset, clearErrors, processing, errors } = useForm<OrderRequest>({
        order_number: '',
        status: OrderStatus.DRAFT,
        total: 0,
        customer_id: '',
        shipment_id: '',
        supplier_id: '',
        order_items: [],
    });
    const prevOrderId = useRef<number | null>(null);

    const [newItem, setNewItem] = useState<OrderItemRequest>({
        product_id: '',
        ctn: '1',
    });

    useEffect(() => {
        if (open && order && order.id !== prevOrderId.current) {
            setData({
                order_number: order.order_number,
                status: order.status,
                total: order.total,
                customer_id: order.customer.id.toString(),
                shipment_id: order.shipment?.id?.toString() ?? '',
                supplier_id: order.supplier?.id?.toString() ?? '',
                order_items: (order.items || []).map((it) => ({
                    product_id: it.product.id.toString(),
                    ctn: it.ctn.toString(),
                })),
            });
            prevOrderId.current = order.id;
        }
        if (!open) {
            reset();
            clearErrors();
            prevOrderId.current = null;
            setNewItem({ product_id: '', ctn: '1' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, order]);

    const itemsTotal = useMemo(() => {
        return data.order_items.reduce((sum, it) => {
            const product = products.find((p) => p.id.toString() === it.product_id);
            return sum + (product?.unit_price || 0) * parseInt(it.ctn || '0');
        }, 0);
    }, [data.order_items, products]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (order) {
            // auto compute total from items
            setData('total', +itemsTotal.toFixed(2));
            put(update.url(order.id), {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (error) => {
                    console.log('EditOrder - handleSubmit => Error ', error);
                },
            });
        }
    };

    // Prepare options for SearchableSelect
    const productOptions: SelectOption[] = products.map((p) => ({ value: p.id.toString(), label: `${p.barcode} - ${p.name}` }));
    const customerOptions: SelectOption[] = customers.map((customer) => ({ value: customer.id.toString(), label: customer.name }));
    const shipmentOptions: SelectOption[] = [
        { value: '', label: 'No shipment' },
        ...shipments.map((shipment) => ({
            value: shipment.id.toString(),
            label: shipment.tracking_number ? `${shipment.tracking_number} (${shipment.carrier})` : `Shipment #${shipment.id}`,
        })),
    ];
    const supplierOptions: SelectOption[] = [
        { value: '', label: 'No supplier' },
        ...suppliers.map((supplier) => ({
            value: supplier.id.toString(),
            label: supplier.name,
        })),
    ];

    const addItem = () => {
        if (!newItem.product_id) {
            setError('order_items', 'Please select a product.');
            return;
        }
        setData('order_items', [newItem, ...data.order_items]);
        setNewItem({ product_id: '', ctn: '1' });
    };

    const removeItem = (idx: number) => {
        const next = [...data.order_items];
        next.splice(idx, 1);
        setData('order_items', next);
    };

    // Per-row handlers for adjusting CTN on existing items
    const setRowCtn = (idx: number, value: string) => {
        const next = [...data.order_items];
        const parsed = Math.max(1, parseInt(value || '1') || 1);
        next[idx] = { ...next[idx], ctn: parsed.toString() };
        setData('order_items', next);
    };

    const incRowCtn = (idx: number) => {
        const next = [...data.order_items];
        const curr = parseInt(next[idx]?.ctn || '0') || 0;
        next[idx] = { ...next[idx], ctn: Math.max(1, curr + 1).toString() };
        setData('order_items', next);
    };

    const decRowCtn = (idx: number) => {
        const next = [...data.order_items];
        const curr = parseInt(next[idx]?.ctn || '0') || 0;
        next[idx] = { ...next[idx], ctn: Math.max(1, curr - 1).toString() };
        setData('order_items', next);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] w-full overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Edit Order</DialogTitle>
                    <DialogDescription>
                        Update the supplier details.
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 px-5 md:grid-cols-2">
                        <div>
                            <Label htmlFor="edit-order_number">
                                Order Number <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-order_number"
                                type="text"
                                value={data.order_number}
                                onChange={(e) => setData('order_number', e.target.value)}
                                placeholder="e.g., ORD-2025-001"
                                required
                            />
                            {errors.order_number && <div className="mt-1 text-sm text-red-600">{errors.order_number}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value as OrderStatus)}>
                                <SelectTrigger id="edit-status" className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {orderStatusOptions.map(({ value, label }) => {
                                        const Icon = OrderStatusIcons[value] || Clock;
                                        return (
                                            <SelectItem key={value} value={value}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    <span>{label}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="edit-customer_id">
                                Customer <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <SearchableSelect
                                options={customerOptions}
                                value={data.customer_id}
                                onValueChange={(value) => setData('customer_id', value)}
                                placeholder="Select a customer"
                                emptyText="No customers found."
                                className={errors.customer_id ? 'border-red-500' : ''}
                            />
                            {errors.customer_id && <div className="mt-1 text-sm text-red-600">{errors.customer_id}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-shipment_id">Shipment</Label>
                            <SearchableSelect
                                options={shipmentOptions}
                                value={data.shipment_id}
                                onValueChange={(value) => setData('shipment_id', value)}
                                placeholder="Select shipment (optional)"
                                emptyText="No shipment found."
                                className={errors.shipment_id ? 'border-red-500' : ''}
                            />
                            {errors.shipment_id && <div className="mt-1 text-sm text-red-600">{errors.shipment_id}</div>}
                        </div>

                        <div className="sm:col-span-1 md:col-span-2">
                            <Label htmlFor="edit-supplier_id">Supplier</Label>
                            <SearchableSelect
                                options={supplierOptions}
                                value={data.supplier_id}
                                onValueChange={(value) => setData('supplier_id', value)}
                                placeholder="Select a supplier"
                                emptyText="No suppliers found."
                                className={errors.supplier_id ? 'border-red-500' : ''}
                            />
                            {errors.supplier_id && <div className="mt-1 text-sm text-red-600">{errors.supplier_id}</div>}
                        </div>
                    </div>

                    <div className="px-5">
                        <div>
                            <MyDivider label="Items" />
                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-9">
                                    <Label>
                                        Product <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                                    </Label>
                                    <SearchableSelect
                                        options={productOptions}
                                        value={newItem.product_id}
                                        onValueChange={(v) => {
                                            setNewItem((s) => ({ ...s, product_id: v }));
                                            setError('order_items', '');
                                        }}
                                        placeholder="Select product"
                                        emptyText="No products found."
                                        className={errors['order_items'] ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>
                                        CTN <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                                    </Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={newItem.ctn}
                                        onChange={(e) => setNewItem((s) => ({ ...s, ctn: e.target.value }))}
                                    />
                                </div>
                                <div className="col-span-1 flex items-end">
                                    <Button type="button" onClick={addItem} variant={'outline'}>
                                        <CirclePlus color={'green'} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {errors.order_items && <div className="text-sm text-red-600">{errors.order_items}</div>}
                        <div className="my-1 rounded-md">
                            {data.order_items.length === 0 ? (
                                <div className="divide-y rounded-xl bg-secondary px-2 text-center">
                                    <div className="p-4 text-sm text-muted-foreground">No items added yet.</div>
                                </div>
                            ) : (
                                <div className="max-h-[200px] divide-y overflow-y-auto px-2">
                                    {data.order_items.map((it, idx) => (
                                        <div key={idx} className="grid grid-cols-12 items-center gap-2 p-2">
                                            <div className="col-span-6">
                                                {productOptions.find((o) => o.value === it.product_id)?.label || 'Product #' + it.product_id}
                                            </div>
                                            <div className="col-span-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => decRowCtn(idx)}
                                                        disabled={processing || (parseInt(it.ctn || '1') || 1) <= 1}
                                                        className="h-6 w-6 border-0"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <Input
                                                        type="text"
                                                        value={it.ctn}
                                                        onChange={(e) => setRowCtn(idx, e.target.value)}
                                                        className="min-w-10 text-center"
                                                        disabled={processing}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => incRowCtn(idx)}
                                                        disabled={processing}
                                                        className="h-6 w-6 border-0"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(idx)}>
                                                    <Trash2 color={'white'} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-5 py-3">
                        <div className={'flex items-center gap-0'}>
                            <Label htmlFor="edit-total" className={'font-bolder mb-0 flex-1'}>
                                Total Amount (auto) : AED {itemsTotal.toFixed(2)}
                            </Label>
                            <Input
                                id="edit-total"
                                className={'flex-1'}
                                type="number"
                                step="0.01"
                                value={itemsTotal.toFixed(2)}
                                hidden
                                readOnly
                                disabled
                            />
                        </div>
                        <Button type="submit" disabled={processing} className={'ml-auto px-6'}>
                            <span
                                className={
                                    processing ? 'absolute opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'
                                }
                            >
                                Update
                            </span>
                            <span
                                className={
                                    processing ? 'opacity-100 transition-opacity duration-300' : 'absolute opacity-0 transition-opacity duration-300'
                                }
                            >
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
