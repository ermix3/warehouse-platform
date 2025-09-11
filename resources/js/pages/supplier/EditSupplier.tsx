import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/suppliers';
import type { Supplier } from '@/types/supplier';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface EditSupplierProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplier: Supplier | null;
}

export default function EditSupplier({ open, onOpenChange, supplier }: Readonly<EditSupplierProps>) {
    const form = useForm<{
        name: string;
        email: string;
        phone: string;
        address: string;
        notes: string;
    }>({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    });

    useEffect(() => {
        if (supplier) {
            form.setData({
                name: supplier.name,
                email: supplier.email ?? '',
                phone: supplier.phone ?? '',
                address: supplier.address ?? '',
                notes: supplier.notes ?? '',
            });
        }
    }, [supplier]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (supplier) {
            form.put(update(supplier.id).url, {
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
                    <DialogTitle>Edit Supplier</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="edit-name">Name *</Label>
                        <Input id="edit-name" type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required />
                        {form.errors.name && <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>}
                    </div>

                    <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input id="edit-email" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                        {form.errors.email && <div className="mt-1 text-sm text-red-600">{form.errors.email}</div>}
                    </div>

                    <div>
                        <Label htmlFor="edit-phone">Phone</Label>
                        <Input id="edit-phone" type="tel" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                        {form.errors.phone && <div className="mt-1 text-sm text-red-600">{form.errors.phone}</div>}
                    </div>

                    <div>
                        <Label htmlFor="edit-address">Address</Label>
                        <Textarea id="edit-address" value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} rows={3} />
                        {form.errors.address && <div className="mt-1 text-sm text-red-600">{form.errors.address}</div>}
                    </div>

                    <div>
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea id="edit-notes" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} rows={3} />
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
