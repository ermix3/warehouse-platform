import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/customers';
import { CustomerRequest, EditCustomerProps } from '@/types/customer';
import { useForm } from '@inertiajs/react';
import { Asterisk, Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

export default function EditCustomer({ open, onOpenChange, customer }: Readonly<EditCustomerProps>) {
    const { data, setData, errors, put, processing } = useForm<CustomerRequest>({
        code: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
        shipping_tax: 0,
        handling_tax: 0,
    });

    useEffect(() => {
        if (customer) {
            setData({
                code: customer.code,
                name: customer.name,
                email: customer.email ?? '',
                phone: customer.phone ?? '',
                address: customer.address ?? '',
                notes: customer.notes ?? '',
                shipping_tax: customer.shipping_tax ?? 0,
                handling_tax: customer.handling_tax ?? 0,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (customer) {
            put(update.url(customer.id), {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (error) => {
                    console.log('EditCustomer - handleSubmit => Error ', error);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[70vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="border-b px-5 py-3">
                    <DialogTitle>Edit Customer</DialogTitle>
                    <DialogDescription>
                        Fill in the user details.{' '}
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="px-5 md:flex md:space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="edit-code">Customer Code *</Label>
                            <Input
                                id="edit-code"
                                type="text"
                                placeholder="e.g. CUST-10001"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                required
                            />
                            {errors.code && <div className="mt-1 text-sm text-red-600">{errors.code}</div>}
                        </div>
                        <div className="mt-4 flex-1 md:mt-0">
                            <Label htmlFor="edit-name">Name *</Label>
                            <Input
                                id="edit-name"
                                type="text"
                                placeholder="e.g. John Doe"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                        </div>
                    </div>

                    <div className="px-5 md:flex md:space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                placeholder="e.g. john@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                        </div>
                        <div className="mt-4 flex-1 md:mt-0">
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input
                                id="edit-phone"
                                type="tel"
                                placeholder="e.g. +1 555-123-4567"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            {errors.phone && <div className="mt-1 text-sm text-red-600">{errors.phone}</div>}
                        </div>
                    </div>

                    <div className="px-5 md:flex md:space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="edit-shipping-tax">Shipping Tax (%)</Label>
                            <Input
                                id="edit-shipping-tax"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="e.g. 5.00"
                                value={data.shipping_tax}
                                onChange={(e) => setData('shipping_tax', +e.target.value)}
                            />
                            {errors.shipping_tax && <div className="mt-1 text-sm text-red-600">{errors.shipping_tax}</div>}
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
                                value={data.handling_tax}
                                onChange={(e) => setData('handling_tax', +e.target.value)}
                            />
                            {errors.handling_tax && <div className="mt-1 text-sm text-red-600">{errors.handling_tax}</div>}
                        </div>
                    </div>

                    <div className="px-5">
                        <Label htmlFor="edit-address">Address</Label>
                        <Textarea
                            id="edit-address"
                            placeholder="e.g. 123 Main St, Springfield, USA"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={3}
                        />
                        {errors.address && <div className="mt-1 text-sm text-red-600">{errors.address}</div>}
                    </div>

                    <div className="px-5">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea
                            id="edit-notes"
                            placeholder="e.g. VIP customer, prefers weekend delivery"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                        />
                        {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className={'px-6'}>
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
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
