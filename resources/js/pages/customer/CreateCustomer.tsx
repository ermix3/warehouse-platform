import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/customers';
import { CreateCustomerProps, CustomerRequest } from '@/types';
import { useForm } from '@inertiajs/react';
import { Asterisk, Loader2 } from 'lucide-react';
import React from 'react';

export default function CreateCustomer({ open, onOpenChange }: Readonly<CreateCustomerProps>) {
    const { data, setData, errors, clearErrors, post, processing, reset } = useForm<CustomerRequest>({
        code: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
        shipping_tax: 0,
        handling_tax: 0,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(store.url(), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
            onError: (error) => {
                console.log('CreateCustomer - handleSubmit => Error ', error);
            },
        });
    };

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[70vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Create Customer</DialogTitle>
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
                            <Label htmlFor="create-code">
                                Customer Code
                                <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-code"
                                type="text"
                                placeholder="e.g. CUST-10001"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                required
                            />
                            {errors.code && <div className="mt-1 text-sm text-red-600">{errors.code}</div>}
                        </div>
                        <div className="mt-4 flex-1 md:mt-0">
                            <Label htmlFor="create-name">
                                Name
                                <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-name"
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
                            <Label htmlFor="create-email">
                                Email
                                <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-email"
                                type="email"
                                placeholder="e.g. john@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                        </div>
                        <div className="mt-4 flex-1 md:mt-0">
                            <Label htmlFor="create-phone">Phone</Label>
                            <Input
                                id="create-phone"
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
                            <Label htmlFor="create-shipping-tax">Shipping Tax (%)</Label>
                            <Input
                                id="create-shipping-tax"
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
                            <Label htmlFor="create-handling-tax">Handling Tax (%)</Label>
                            <Input
                                id="create-handling-tax"
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
                        <Label htmlFor="create-address">Address</Label>
                        <Textarea
                            id="create-address"
                            placeholder="e.g. 123 Main St, Springfield, USA"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={3}
                        />
                        {errors.address && <div className="mt-1 text-sm text-red-600">{errors.address}</div>}
                    </div>

                    <div className="px-5">
                        <Label htmlFor="create-notes">Notes</Label>
                        <Textarea
                            id="create-notes"
                            placeholder="e.g. VIP customer, prefers weekend delivery"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                        />
                        {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                    </div>

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-6 py-3">
                        <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className={'px-6'}>
                            <span
                                className={
                                    processing ? 'absolute opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'
                                }
                            >
                                Create
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
