import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/suppliers';
import { EditSupplierProps, SupplierRequest } from '@/types/supplier';
import { useForm } from '@inertiajs/react';
import { Asterisk, Loader2 } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';

export default function EditSupplier({ open, onOpenChange, supplier }: Readonly<EditSupplierProps>) {
    const { data, setData, errors, clearErrors, put, processing } = useForm<SupplierRequest>({
        code: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    });

    const resetForm = useCallback(() => {
        if (supplier) {
            setData({
                code: supplier.code,
                name: supplier.name,
                email: supplier.email ?? '',
                phone: supplier.phone ?? '',
                address: supplier.address ?? '',
                notes: supplier.notes ?? '',
            });
            clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplier]);

    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open, resetForm]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!supplier) return;

        put(update.url(supplier.id), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
            onError: (error) => {
                console.log('EditSupplier - handleSubmit => Error ', error);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[60vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="border-b px-5 py-3">
                    <DialogTitle>Edit Supplier</DialogTitle>
                    <DialogDescription>
                        Update the supplier details.
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 px-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-code">
                                Code <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-code"
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="e.g., SUP-001"
                                required
                            />
                            {errors.code && <div className="mt-1 text-sm text-red-600">{errors.code}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-name">
                                Name <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g., ABC Electronics"
                                required
                            />
                            {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="e.g., contact@example.com"
                            />
                            {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input
                                id="edit-phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="e.g., +1 (555) 123-4567"
                            />
                            {errors.phone && <div className="mt-1 text-sm text-red-600">{errors.phone}</div>}
                        </div>
                    </div>

                    <div className="space-y-2 px-5">
                        <Label htmlFor="edit-address">Address</Label>
                        <Textarea
                            id="edit-address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={3}
                            placeholder="e.g., 123 Business St, City, Country, ZIP"
                        />
                        {errors.address && <div className="mt-1 text-sm text-red-600">{errors.address}</div>}
                    </div>

                    <div className="space-y-2 px-5">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea
                            id="edit-notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                            placeholder="Any additional information about this supplier..."
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
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
