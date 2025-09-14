import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { store } from '@/routes/orders';
import { CreateOrderProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function CreateOrder({ open, onOpenChange, customers, shippings, products }: Readonly<CreateOrderProps>) {
    const form = useForm({
        order_number: '',
        status: 'draft',
        total: '',
        customer_id: '',
        shipping_id: '',
        order_items: [] as { product_id: string; quantity: string; unit_price: string }[],
    });

    const [newItem, setNewItem] = useState<{ product_id: string; quantity: string; unit_price: string }>({
        product_id: '',
        quantity: '1',
        unit_price: '0',
    });

    const itemsTotal = useMemo(() => {
        return form.data.order_items.reduce((sum, it) => sum + parseFloat(it.unit_price || '0') * parseInt(it.quantity || '0'), 0);
    }, [form.data.order_items]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // compute total from items before submit
        form.setData('total', itemsTotal.toFixed(2));
        form.post(store().url, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
            },
            onError: (error) => {
                form.setError(error);
            },
        });
    };

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset();
            form.clearErrors();
            setNewItem({ product_id: '', quantity: '1', unit_price: '0' });
        }
        onOpenChange(isOpen);
    };

    // Prepare options for SearchableSelect
    const customerOptions = customers.map((customer) => ({
        value: customer.id.toString(),
        label: customer.name,
    }));

    const shippingOptions = [
        { value: '', label: 'No shipping' },
        ...shippings.map((shipping) => ({
            value: shipping.id.toString(),
            label: shipping.tracking_number ? `${shipping.tracking_number} (${shipping.carrier})` : `Shipping #${shipping.id}`,
        })),
    ];

    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const productOptions = products.map((p) => ({ value: p.id.toString(), label: p.name }));

    const fieldErrors = form.errors as Record<string, string>;

    const addItem = () => {
        if (!newItem.product_id) return; // simple guard
        form.setData('order_items', [...form.data.order_items, newItem]);
        setNewItem({ product_id: '', quantity: '1', unit_price: '0' });
    };

    const removeItem = (idx: number) => {
        const next = [...form.data.order_items];
        next.splice(idx, 1);
        form.setData('order_items', next);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Order</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="create-order_number">Order Number *</Label>
                            <Input
                                id="create-order_number"
                                type="text"
                                value={form.data.order_number}
                                onChange={(e) => form.setData('order_number', e.target.value)}
                                placeholder="e.g., ORD-2025-001"
                            />
                            {form.errors.order_number && <div className="mt-1 text-sm text-red-600">{form.errors.order_number}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-status">Status *</Label>
                            <SearchableSelect
                                options={statusOptions}
                                value={form.data.status}
                                onValueChange={(value) => form.setData('status', value)}
                                placeholder="Select status"
                                emptyText="No status found."
                                className={form.errors.status ? 'border-red-500' : ''}
                            />
                            {form.errors.status && <div className="mt-1 text-sm text-red-600">{form.errors.status}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-total">Total Amount (auto)</Label>
                            <Input id="create-total" type="number" step="0.01" value={itemsTotal.toFixed(2)} readOnly />
                            {form.errors.total && <div className="mt-1 text-sm text-red-600">{form.errors.total}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-customer_id">Customer *</Label>
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

                        <div className="md:col-span-2">
                            <Label htmlFor="create-shipping_id">Shipping</Label>
                            <SearchableSelect
                                options={shippingOptions}
                                value={form.data.shipping_id}
                                onValueChange={(value) => form.setData('shipping_id', value)}
                                placeholder="Select shipping (optional)"
                                emptyText="No shipping found."
                                className={form.errors.shipping_id ? 'border-red-500' : ''}
                            />
                            {form.errors.shipping_id && <div className="mt-1 text-sm text-red-600">{form.errors.shipping_id}</div>}
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
                                <div className="col-span-2">
                                    <Label>Quantity *</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem((s) => ({ ...s, quantity: e.target.value }))}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Unit Price *</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={newItem.unit_price}
                                        onChange={(e) => setNewItem((s) => ({ ...s, unit_price: e.target.value }))}
                                    />
                                </div>
                                <div className="col-span-2 flex items-end">
                                    <Button type="button" onClick={addItem}>
                                        Add
                                    </Button>
                                </div>
                            </div>
                            {fieldErrors['order_items.*.product_id'] && <div className="text-sm text-red-600">Please check product selection.</div>}
                            {fieldErrors['order_items.*.quantity'] && <div className="text-sm text-red-600">Please check quantity.</div>}
                            {fieldErrors['order_items.*.unit_price'] && <div className="text-sm text-red-600">Please check unit price.</div>}
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
                                            <div className="col-span-2">Qty: {it.quantity}</div>
                                            <div className="col-span-2">Price: ${parseFloat(it.unit_price || '0').toFixed(2)}</div>
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

                    <div className="flex justify-end space-x-2">
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
