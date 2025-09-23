import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/customers';
import { EditCustomerProps } from '@/types/customer';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

export default function EditCustomer({ open, onOpenChange, customer }: Readonly<EditCustomerProps>) {
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

    useEffect(() => {
        if (customer) {
            form.setData({
                code: customer.code,
                name: customer.name,
                email: customer.email ?? '',
                phone: customer.phone ?? '',
                address: customer.address ?? '',
                notes: customer.notes ?? '',
                shipping_tax: customer.shipping_tax?.toString() ?? '',
                handling_tax: customer.handling_tax?.toString() ?? '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (customer) {
            form.put(update.url(customer.id), {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="md:flex md:space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="edit-code">Customer Code *</Label>
                            <Input
                                id="edit-code"
                                type="text"
                                placeholder="e.g. CUST-10001"
                                value={form.data.code}
                                onChange={(e) => form.setData('code', e.target.value)}
                                required
                            />
                            {form.errors.code && <div className="mt-1 text-sm text-red-600">{form.errors.code}</div>}
                        </div>
                        <div className="mt-4 flex-1 md:mt-0">
                            <Label htmlFor="edit-name">Name *</Label>
                            <Input
                                id="edit-name"
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
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                placeholder="e.g. john@example.com"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                            />
                            {form.errors.email && <div className="mt-1 text-sm text-red-600">{form.errors.email}</div>}
                        </div>
                        <div className="mt-4 flex-1 md:mt-0">
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input
                                id="edit-phone"
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
                            <Label htmlFor="edit-shipping-tax">Shipping Tax (%)</Label>
                            <Input
                                id="edit-shipping-tax"
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
                            <Label htmlFor="edit-handling-tax">Handling Tax (%)</Label>
                            <Input
                                id="edit-handling-tax"
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
                        <Label htmlFor="edit-address">Address</Label>
                        <Textarea
                            id="edit-address"
                            placeholder="e.g. 123 Main St, Springfield, USA"
                            value={form.data.address}
                            onChange={(e) => form.setData('address', e.target.value)}
                            rows={3}
                        />
                        {form.errors.address && <div className="mt-1 text-sm text-red-600">{form.errors.address}</div>}
                    </div>

                    <div>
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea
                            id="edit-notes"
                            placeholder="e.g. VIP customer, prefers weekend delivery"
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            rows={3}
                        />
                        {form.errors.notes && <div className="mt-1 text-sm text-red-600">{form.errors.notes}</div>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
