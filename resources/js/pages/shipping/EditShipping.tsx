import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/shippings';
import { Shipping } from '@/types/shipping';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

interface EditShippingProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shipping: Shipping | null;
}

export default function EditShipping({ open, onOpenChange, shipping }: Readonly<EditShippingProps>) {
    const form = useForm({
        tracking_number: '',
        carrier: '',
        status: 'pending',
        total: '',
        notes: '',
    });
    const prevIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (open && shipping && shipping.id !== prevIdRef.current) {
            form.setData({
                tracking_number: shipping.tracking_number ?? '',
                carrier: shipping.carrier ?? '',
                status: shipping.status,
                total: shipping.total.toString(),
                notes: '',
            });
            prevIdRef.current = shipping.id;
        }
        if (!open) {
            form.reset();
            form.clearErrors();
            prevIdRef.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, shipping]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (shipping) {
            form.put(update(shipping.id).url, {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Shipping</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="edit-tracking_number">Tracking Number</Label>
                            <Input id="edit-tracking_number" type="text" value={form.data.tracking_number} onChange={(e) => form.setData('tracking_number', e.target.value)} />
                            {form.errors.tracking_number && <div className="mt-1 text-sm text-red-600">{form.errors.tracking_number}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-carrier">Carrier</Label>
                            <Input id="edit-carrier" type="text" value={form.data.carrier} onChange={(e) => form.setData('carrier', e.target.value)} />
                            {form.errors.carrier && <div className="mt-1 text-sm text-red-600">{form.errors.carrier}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-status">Status *</Label>
                            <Select value={form.data.status} onValueChange={(value) => form.setData('status', value)}>
                                <SelectTrigger id="edit-status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_transit">In Transit</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="returned">Returned</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.errors.status && <div className="mt-1 text-sm text-red-600">{form.errors.status}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-total">Total *</Label>
                            <Input id="edit-total" type="number" step="0.01" value={form.data.total} onChange={(e) => form.setData('total', e.target.value)} />
                            {form.errors.total && <div className="mt-1 text-sm text-red-600">{form.errors.total}</div>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea id="edit-notes" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} rows={3} />
                        {form.errors.notes && <div className="mt-1 text-sm text-red-600">{form.errors.notes}</div>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}


