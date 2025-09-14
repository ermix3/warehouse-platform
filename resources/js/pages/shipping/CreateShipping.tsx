import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ShippingStatusIcons } from '@/lib/shipping-status-helper';
import { store } from '@/routes/shippings';
import { CreateShippingProps, PageShippingProps } from '@/types';
import { ShippingStatus } from '@/types/enums';
import { useForm, usePage } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { useState } from 'react';

export default function CreateShipping({ open, onOpenChange }: Readonly<CreateShippingProps>) {
    const { enums } = usePage<PageShippingProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        tracking_number: '',
        carrier: '',
        status: ShippingStatus.PENDING,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        form.post(store().url, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
                setIsSubmitting(false);
            },
            onError: (error) => {
                form.setError(error);
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
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

    // Get shipping status options from the shared enums
    const shippingStatusOptions = Object.values(enums.shippingStatus);

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Shipping</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="create-tracking_number">Tracking Number</Label>
                            <Input
                                id="create-tracking_number"
                                type="text"
                                value={form.data.tracking_number}
                                onChange={(e) => form.setData('tracking_number', e.target.value)}
                                placeholder="Enter tracking number"
                                className={form.errors.tracking_number ? 'border-red-500' : ''}
                            />
                            {form.errors.tracking_number && <div className="mt-1 text-sm text-red-600">{form.errors.tracking_number}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-carrier">Carrier</Label>
                            <Input
                                id="create-carrier"
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
                        <Label htmlFor="create-status">Status</Label>
                        <Select value={form.data.status} onValueChange={(value) => form.setData('status', value as ShippingStatus)}>
                            <SelectTrigger id="create-status" className={form.errors.status ? 'border-red-500' : ''}>
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
                        <Label htmlFor="create-notes">Notes</Label>
                        <Textarea
                            id="create-notes"
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            rows={3}
                            placeholder="Additional information about this shipping"
                        />
                        {form.errors.notes && <div className="mt-1 text-sm text-red-600">{form.errors.notes}</div>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => handleDialogChange(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Shipping'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
