import { MyDivider } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatusIcons } from '@/lib/order-status-helper';
import { update } from '@/routes/orders';
import { EditOrderProps, PageOrderProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Asterisk, CirclePlus, Clock, Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function EditOrder({ open, onOpenChange, order, customers, shipments, products, suppliers }: Readonly<EditOrderProps>) {
    const { enums } = usePage<PageOrderProps>().props;
    const form = useForm({
        order_number: '',
        status: 'draft',
        total: '',
        customer_id: '',
        shipment_id: '',
        supplier_id: '',
        order_items: [] as { product_id: string; ctn: string }[],
    });
    const prevOrderId = useRef<number | null>(null);

    const [newItem, setNewItem] = useState<{ product_id: string; ctn: string }>({
        product_id: '',
        ctn: '1',
    });

    useEffect(() => {
        if (open && order && order.id !== prevOrderId.current) {
            form.setData({
                order_number: order.order_number,
                status: order.status,
                total: order.total.toString(),
                customer_id: order.customer_id.toString(),
                shipment_id: order.shipment_id?.toString() ?? '',
                supplier_id: order.supplier_id?.toString() ?? '',
                order_items: (order.items || []).map((it) => ({
                    product_id: it.product_id.toString(),
                    ctn: it.ctn.toString(),
                })),
            });
            prevOrderId.current = order.id;
        }
        if (!open) {
            form.reset();
            form.clearErrors();
            prevOrderId.current = null;
            setNewItem({ product_id: '', ctn: '1' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, order]);

    const itemsTotal = useMemo(() => {
        return form.data.order_items.reduce((sum, it) => {
            const product = products.find((p) => p.id.toString() === it.product_id);
            return sum + (product?.unit_price || 0) * parseInt(it.ctn || '0');
        }, 0);
    }, [form.data.order_items, products]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (order) {
            // auto compute total from items
            form.setData('total', itemsTotal.toFixed(2));
            form.put(update.url(order.id), {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    // Prepare options for SearchableSelect
    const statusOptions = Object.values(enums.orderStatus);
    const productOptions = products.map((p) => ({ value: p.id.toString(), label: p.name }));
    const customerOptions = customers.map((customer) => ({
        value: customer.id.toString(),
        label: customer.name,
    }));
    const shipmentOptions = [
        { value: '', label: 'No shipment' },
        ...shipments.map((shipment) => ({
            value: shipment.id.toString(),
            label: shipment.tracking_number ? `${shipment.tracking_number} (${shipment.carrier})` : `Shipment #${shipment.id}`,
        })),
    ];
    const supplierOptions = [
        { value: '', label: 'No supplier' },
        ...suppliers.map((supplier) => ({
            value: supplier.id.toString(),
            label: supplier.name,
        })),
    ];

    const fieldErrors = form.errors as Record<string, string>;

    const addItem = () => {
        if (!newItem.product_id) {
            form.setError('order_items', 'Please select a product.');
            return;
        }
        form.setData('order_items', [...form.data.order_items, newItem]);
        setNewItem({ product_id: '', ctn: '1' });
    };

    const removeItem = (idx: number) => {
        const next = [...form.data.order_items];
        next.splice(idx, 1);
        form.setData('order_items', next);
    };

    // Per-row handlers for adjusting CTN on existing items
    const setRowCtn = (idx: number, value: string) => {
        const next = [...form.data.order_items];
        const parsed = Math.max(1, parseInt(value || '1') || 1);
        next[idx] = { ...next[idx], ctn: parsed.toString() };
        form.setData('order_items', next);
    };

    const incRowCtn = (idx: number) => {
        const next = [...form.data.order_items];
        const curr = parseInt(next[idx]?.ctn || '0') || 0;
        next[idx] = { ...next[idx], ctn: Math.max(1, curr + 1).toString() };
        form.setData('order_items', next);
    };

    const decRowCtn = (idx: number) => {
        const next = [...form.data.order_items];
        const curr = parseInt(next[idx]?.ctn || '0') || 0;
        next[idx] = { ...next[idx], ctn: Math.max(1, curr - 1).toString() };
        form.setData('order_items', next);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="ovrflow-y-auto max-h-[87vh] max-w-7xl">
                <DialogHeader>
                    <DialogTitle>Edit Order</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="edit-order_number">
                                Order Number <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-order_number"
                                type="text"
                                value={form.data.order_number}
                                onChange={(e) => form.setData('order_number', e.target.value)}
                                placeholder="e.g., ORD-2025-001"
                            />
                            {form.errors.order_number && <div className="mt-1 text-sm text-red-600">{form.errors.order_number}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={form.data.status} onValueChange={(value) => form.setData('status', value)}>
                                <SelectTrigger id="edit-status" className={form.errors.status ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map(({ value, label }) => {
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
                                value={form.data.customer_id}
                                onValueChange={(value) => form.setData('customer_id', value)}
                                placeholder="Select a customer"
                                emptyText="No customers found."
                                className={form.errors.customer_id ? 'border-red-500' : ''}
                            />
                            {form.errors.customer_id && <div className="mt-1 text-sm text-red-600">{form.errors.customer_id}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-shipment_id">Shipment</Label>
                            <SearchableSelect
                                options={shipmentOptions}
                                value={form.data.shipment_id}
                                onValueChange={(value) => form.setData('shipment_id', value)}
                                placeholder="Select shipment (optional)"
                                emptyText="No shipment found."
                                className={form.errors.shipment_id ? 'border-red-500' : ''}
                            />
                            {form.errors.shipment_id && <div className="mt-1 text-sm text-red-600">{form.errors.shipment_id}</div>}
                        </div>

                        <div className="sm:col-span-1 md:col-span-2">
                            <Label htmlFor="edit-supplier_id">Supplier</Label>
                            <SearchableSelect
                                options={supplierOptions}
                                value={form.data.supplier_id}
                                onValueChange={(value) => form.setData('supplier_id', value)}
                                placeholder="Select a supplier"
                                emptyText="No suppliers found."
                                className={form.errors.supplier_id ? 'border-red-500' : ''}
                            />
                            {form.errors.supplier_id && <div className="mt-1 text-sm text-red-600">{form.errors.supplier_id}</div>}
                        </div>
                    </div>

                    <div>
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
                                            form.setError('order_items', '');
                                        }}
                                        placeholder="Select product"
                                        emptyText="No products found."
                                        className={fieldErrors['order_items'] ? 'border-red-500' : ''}
                                        disabled={form.processing}
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
                            {fieldErrors['order_items.*.product_id'] && <div className="text-sm text-red-600">Please check product selection.</div>}
                            {fieldErrors['order_items.*.ctn'] && <div className="text-sm text-red-600">Please check carton quantity.</div>}
                        </div>
                        {fieldErrors.order_items && <div className="text-sm text-red-600">{fieldErrors.order_items}</div>}
                        <div className="my-1 rounded-md">
                            {form.data.order_items.length === 0 ? (
                                <div className="divide-y rounded-xl bg-secondary px-2 text-center">
                                    <div className="p-4 text-sm text-muted-foreground">No items added yet.</div>
                                </div>
                            ) : (
                                <div className="max-h-[200px] divide-y overflow-y-auto px-2">
                                    {form.data.order_items.toReversed().map((it, idx) => (
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
                                                        disabled={form.processing || (parseInt(it.ctn || '1') || 1) <= 1}
                                                        className="h-6 w-6 border-0"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <Input
                                                        type="text"
                                                        value={it.ctn}
                                                        onChange={(e) => setRowCtn(idx, e.target.value)}
                                                        className="min-w-10 text-center"
                                                        disabled={form.processing}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => incRowCtn(idx)}
                                                        disabled={form.processing}
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

                    <div className="flex justify-between">
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
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
