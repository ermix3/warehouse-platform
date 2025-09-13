import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { store } from '@/routes/orders';
import { useForm } from '@inertiajs/react';

interface Customer {
    id: number;
    name: string;
}

interface Shipping {
    id: number;
    tracking_number?: string;
    carrier?: string;
}

interface CreateOrderProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: Customer[];
    shippings: Shipping[];
}

export default function CreateOrder({ open, onOpenChange, customers, shippings }: Readonly<CreateOrderProps>) {
    const form = useForm({
        order_number: '',
        status: 'draft',
        total: '',
        customer_id: '',
        shipping_id: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
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
                            <Label htmlFor="create-total">Total Amount *</Label>
                            <Input
                                id="create-total"
                                type="number"
                                step="0.01"
                                value={form.data.total}
                                onChange={(e) => form.setData('total', e.target.value)}
                                placeholder="0.00"
                            />
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
