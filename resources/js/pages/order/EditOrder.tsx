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
import { CirclePlus, Clock } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function EditOrder({ open, onOpenChange, order, customers, shipments, products }: Readonly<EditOrderProps>) {
    const { enums } = usePage<PageOrderProps>().props;
    const form = useForm({
        order_number: '',
        status: 'draft',
        total: '',
        customer_id: '',
        shipment_id: '',
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

    const statusOptions = Object.values(enums.orderStatus);

    const productOptions = products.map((p) => ({ value: p.id.toString(), label: p.name }));
    const fieldErrors = form.errors as Record<string, string>;

    const addItem = () => {
        if (!newItem.product_id) return;
        form.setData('order_items', [...form.data.order_items, newItem]);
        setNewItem({ product_id: '', ctn: '1' });
    };

    const removeItem = (idx: number) => {
        const next = [...form.data.order_items];
        next.splice(idx, 1);
        form.setData('order_items', next);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Order</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="edit-order_number">Order Number *</Label>
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
                            <Label htmlFor="edit-customer_id">Customer *</Label>
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
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <div className="font-medium">Items</div>
                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-6">
                                    <Label>Product *</Label>
                                    <SearchableSelect
                                        options={productOptions}
                                        value={newItem.product_id}
                                        onValueChange={(v) => setNewItem((s) => ({ ...s, product_id: v }))}
                                        placeholder="Select product"
                                        emptyText="No products found."
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Label>Cartons *</Label>
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
                        <div className="rounded-md border">
                            {form.data.order_items.length === 0 ? (
                                <div className="p-4 text-sm text-muted-foreground">No items added yet.</div>
                            ) : (
                                <div className="divide-y">
                                    {form.data.order_items.map((it, idx) => (
                                        <div key={idx} className="grid grid-cols-12 items-center gap-2 p-2">
                                            <div className="col-span-6">
                                                {productOptions.find((o) => o.value === it.product_id)?.label || 'Product #' + it.product_id}
                                            </div>
                                            <div className="col-span-2">Cartons: {it.ctn}</div>
                                            <div className="col-span-2 text-right">
                                                <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(idx)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between space-x-2">
                        <div className={'flex items-center gap-0'}>
                            <Label htmlFor="create-total" className={'font-bolder mb-0 flex-1'}>
                                Total Amount (auto) : AED {itemsTotal.toFixed(2)}
                            </Label>
                            <Input
                                id="create-total"
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
