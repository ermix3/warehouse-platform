import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ShippingStatusIcons } from '@/lib/shipping-status-helper';
import { update } from '@/routes/shippings';
import { EditShippingProps, PageShippingProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function EditShipping({ open, onOpenChange, shipping }: Readonly<EditShippingProps>) {
    const { enums } = usePage<PageShippingProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        tracking_number: '',
        carrier: '',
        status: '',
        notes: '',
    });

    const prevIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (open && shipping && shipping.id !== prevIdRef.current) {
            form.setData({
                tracking_number: shipping.tracking_number ?? '',
                carrier: shipping.carrier ?? '',
                status: shipping.status ?? 'pending',
                notes: shipping.notes ?? '',
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

        if (!shipping) return;

        setIsSubmitting(true);
        form.put(update(shipping.id).url, {
            onSuccess: () => {
                onOpenChange(false);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                form.setError(errors);
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    // Get shipping status options from the shared enums
    const shippingStatusOptions = Object.values(enums.shippingStatus);

    if (!shipping) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Shipping {shipping.tracking_number ? `#${shipping.tracking_number}` : `ID: ${shipping.id}`}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="edit-tracking_number">Tracking Number</Label>
                            <Input
                                id="edit-tracking_number"
                                type="text"
                                value={form.data.tracking_number}
                                onChange={(e) => form.setData('tracking_number', e.target.value)}
                                placeholder="Enter tracking number"
                                className={form.errors.tracking_number ? 'border-red-500' : ''}
                            />
                            {form.errors.tracking_number && <div className="mt-1 text-sm text-red-600">{form.errors.tracking_number}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-carrier">Carrier</Label>
                            <Input
                                id="edit-carrier"
                                type="text"
                                value={form.data.carrier}
                                onChange={(e) => form.setData('carrier', e.target.value)}
                                placeholder="FedEx, UPS, USPS, etc."
                                className={form.errors.carrier ? 'border-red-500' : ''}
                            />
                            {form.errors.carrier && <div className="mt-1 text-sm text-red-600">{form.errors.carrier}</div>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="edit-status">Status</Label>
                        <Select value={form.data.status} onValueChange={(value) => form.setData('status', value)}>
                            <SelectTrigger id="edit-status" className={form.errors.status ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {shippingStatusOptions.map(({ value, label }) => {
                                    const Icon = ShippingStatusIcons[value] || Clock;
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
                        {form.errors.status && <div className="mt-1 text-sm text-red-600">{form.errors.status}</div>}
                    </div>

                    <div>
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea
                            id="edit-notes"
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            rows={3}
                            placeholder="Additional information about this shipping"
                        />
                        {form.errors.notes && <div className="mt-1 text-sm text-red-600">{form.errors.notes}</div>}
                    </div>

                    {shipping.orders_count > 0 && (
                        <div className="rounded-md bg-blue-50 p-4 text-blue-800">
                            <p className="text-sm font-medium">This shipping has {shipping.orders_count} associated orders.</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Update Shipping'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
