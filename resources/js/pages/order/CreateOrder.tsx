import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatusIcons } from '@/lib/order-status-helper';
import { store } from '@/routes/orders';
import { CreateOrderProps, PageOrderProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Asterisk, CirclePlus, Clock, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function CreateOrder({ open, onOpenChange, customers, shippings, products }: Readonly<CreateOrderProps>) {
    const { enums } = usePage<PageOrderProps>().props;
    const form = useForm({
        order_number: '',
        status: 'draft',
        total: '',
        customer_id: '',
        shipping_id: '',
        order_items: [] as { product_id: string; ctn: string }[],
    });

    const [newItem, setNewItem] = useState<{ product_id: string; ctn: string }>({
        product_id: '',
        ctn: '1',
    });

    const itemsTotal = useMemo(() => {
        return form.data.order_items.reduce((sum, it) => {
            const product = products.find((p) => p.id.toString() === it.product_id);
            return sum + (product?.unit_price || 0) * parseInt(it.ctn || '0');
        }, 0);
    }, [form.data.order_items, products]);

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
            setNewItem({ product_id: '', ctn: '1' });
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

    const statusOptions = Object.values(enums.orderStatus);

    const productOptions = products.map((p) => ({ value: p.id.toString(), label: p.name }));

    const fieldErrors = form.errors as Record<string, string>;

    const addItem = () => {
        if (!newItem.product_id) return; // simple guard
        form.setData('order_items', [...form.data.order_items, newItem]);
        setNewItem({ product_id: '', ctn: '1' });
    };

    const removeItem = (idx: number) => {
        const next = [...form.data.order_items];
        next.splice(idx, 1);
        form.setData('order_items', next);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[85vh] max-w-6xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Order</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="create-order_number">Order Number <Asterisk color={'red'} size={12} className={'inline-flex align-super'} /></Label>
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
                            <Label htmlFor="create-status">Status</Label>
                            <Select value={form.data.status} onValueChange={(value) => form.setData('status', value)}>
                                <SelectTrigger id="create-status" className={form.errors.status ? 'border-red-500' : ''}>
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
                            <Label htmlFor="create-customer_id">Customer <Asterisk color={'red'} size={12} className={'inline-flex align-super'} /></Label>
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
                                <div className="col-span-9">
                                    <Label>Product <Asterisk color={'red'} size={12} className={'inline-flex align-super'} /></Label>
                                    <SearchableSelect
                                        options={productOptions}
                                        value={newItem.product_id}
                                        onValueChange={(v) => setNewItem((s) => ({ ...s, product_id: v }))}
                                        placeholder="Select product"
                                        emptyText="No products found."
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>CTN <Asterisk color={'red'} size={12} className={'inline-flex align-super'} /></Label>
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
                                            <div className="col-span-4">CTN: {it.ctn}</div>
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
                            {form.processing ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
