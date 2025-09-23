import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/customers';
import { CreateCustomerProps } from '@/types';
import { useForm } from '@inertiajs/react';

export default function CreateCustomer({ open, onOpenChange }: Readonly<CreateCustomerProps>) {
    const form = useForm<{
        code: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        notes: string;
        shipping_tax: string;
        handling_tax: string;
    }>({
        code: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
        shipping_tax: '',
        handling_tax: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post(store().url, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
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

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="md:flex md:space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="create-code">Customer Code *</Label>
                            <Input
                                id="create-code"
                                type="text"
                                placeholder="e.g. CUST-10001"
                                value={form.data.code}
                                onChange={(e) => form.setData('code', e.target.value)}
                                required
                            />
                            {form.errors.code && <div className="mt-1 text-sm text-red-600">{form.errors.code}</div>}
                        </div>
                        <div className="mt-4 flex-1 md:mt-0">
                            <Label htmlFor="create-name">Name *</Label>
                            <Input
                                id="create-name"
                                type="text"
                                placeholder="e.g. John Doe"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                required
                            />
                            {form.errors.name && <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>}
                        </div>
                    </div>

                    <div className="md:flex md:space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                placeholder="e.g. john@example.com"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                            />
                            {form.errors.email && <div className="mt-1 text-sm text-red-600">{form.errors.email}</div>}
                        </div>
                        <div className="mt-4 flex-1 md:mt-0">
                            <Label htmlFor="create-phone">Phone</Label>
                            <Input
                                id="create-phone"
                                type="tel"
                                placeholder="e.g. +1 555-123-4567"
                                value={form.data.phone}
                                onChange={(e) => form.setData('phone', e.target.value)}
                            />
                            {form.errors.phone && <div className="mt-1 text-sm text-red-600">{form.errors.phone}</div>}
                        </div>
                    </div>

                    <div className="md:flex md:space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="create-shipping-tax">Shipping Tax (%)</Label>
                            <Input
                                id="create-shipping-tax"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="e.g. 5.00"
                                value={form.data.shipping_tax}
                                onChange={(e) => form.setData('shipping_tax', e.target.value)}
                            />
                            {form.errors.shipping_tax && <div className="mt-1 text-sm text-red-600">{form.errors.shipping_tax}</div>}
                        </div>
                        <div className="mt-4 flex-1 md:mt-0">
                            <Label htmlFor="create-handling-tax">Handling Tax (%)</Label>
                            <Input
                                id="create-handling-tax"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="e.g. 2.50"
                                value={form.data.handling_tax}
                                onChange={(e) => form.setData('handling_tax', e.target.value)}
                            />
                            {form.errors.handling_tax && <div className="mt-1 text-sm text-red-600">{form.errors.handling_tax}</div>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="create-address">Address</Label>
                        <Textarea
                            id="create-address"
                            placeholder="e.g. 123 Main St, Springfield, USA"
                            value={form.data.address}
                            onChange={(e) => form.setData('address', e.target.value)}
                            rows={3}
                        />
                        {form.errors.address && <div className="mt-1 text-sm text-red-600">{form.errors.address}</div>}
                    </div>

                    <div>
                        <Label htmlFor="create-notes">Notes</Label>
                        <Textarea
                            id="create-notes"
                            placeholder="e.g. VIP customer, prefers weekend delivery"
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            rows={3}
                        />
                        {form.errors.notes && <div className="mt-1 text-sm text-red-600">{form.errors.notes}</div>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
