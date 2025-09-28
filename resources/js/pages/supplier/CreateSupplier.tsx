import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/suppliers';
import { CreateSupplierProps, SupplierRequest } from '@/types/supplier';
import { useForm } from '@inertiajs/react';
import { Asterisk, Loader2 } from 'lucide-react';
import React, { useCallback } from 'react';

export default function CreateSupplier({ open, onOpenChange }: Readonly<CreateSupplierProps>) {
    const { data, setData, errors, reset, clearErrors, post, processing } = useForm<SupplierRequest>({
        code: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    });

    const resetForm = useCallback(() => {
        reset();
        clearErrors();
    }, [reset, clearErrors]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                resetForm();
            },
            onError: (error) => {
                console.log('CreateSupplier - handleSubmit => Error ', error);
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
            <DialogContent className="max-h-[60vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Create Supplier</DialogTitle>
                    <DialogDescription>
                        Fill in the supplier details.
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 px-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-code">
                                Supplier Code <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-code"
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="e.g. SUP-001"
                                required
                            />
                            {errors.code && <div className="mt-1 text-sm text-red-600">{errors.code}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-name">
                                Name <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. ABC Electronics"
                                required
                            />
                            {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="e.g. contact@example.com"
                            />
                            {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-phone">Phone</Label>
                            <Input
                                id="create-phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="e.g. +1 (555) 123-4567"
                            />
                            {errors.phone && <div className="mt-1 text-sm text-red-600">{errors.phone}</div>}
                        </div>
                    </div>

                    <div className="space-y-2 px-5">
                        <Label htmlFor="create-address">Address</Label>
                        <Textarea
                            id="create-address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="e.g. 123 Business St, City, Country"
                            rows={3}
                        />
                        {errors.address && <div className="mt-1 text-sm text-red-600">{errors.address}</div>}
                    </div>

                    <div className="space-y-2 px-5">
                        <Label htmlFor="create-notes">Notes</Label>
                        <Textarea
                            id="create-notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="e.g. Preferred contact method: email, Business hours: 9AM-5PM"
                            rows={3}
                        />
                        {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                    </div>

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-5 py-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
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
