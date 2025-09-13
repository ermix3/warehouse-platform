import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/shippings';
import { useForm } from '@inertiajs/react';

interface CreateShippingProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateShipping({ open, onOpenChange }: Readonly<CreateShippingProps>) {
    const form = useForm({
        tracking_number: '',
        carrier: '',
        status: 'pending',
        cost: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post(index().url, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
            },
            onError: (error) => {
                form.setError(error);
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
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Shipping</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="create-tracking_number">Tracking Number</Label>
                            <Input id="create-tracking_number" type="text" value={form.data.tracking_number} onChange={(e) => form.setData('tracking_number', e.target.value)} />
                            {form.errors.tracking_number && <div className="mt-1 text-sm text-red-600">{form.errors.tracking_number}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-carrier">Carrier</Label>
                            <Input id="create-carrier" type="text" value={form.data.carrier} onChange={(e) => form.setData('carrier', e.target.value)} />
                            {form.errors.carrier && <div className="mt-1 text-sm text-red-600">{form.errors.carrier}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-status">Status *</Label>
                            <Select value={form.data.status} onValueChange={(value) => form.setData('status', value)}>
                                <SelectTrigger id="create-status">
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
                            <Label htmlFor="create-cost">Cost *</Label>
                            <Input id="create-cost" type="number" step="0.01" value={form.data.cost} onChange={(e) => form.setData('cost', e.target.value)} />
                            {form.errors.cost && <div className="mt-1 text-sm text-red-600">{form.errors.cost}</div>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="create-notes">Notes</Label>
                        <Textarea id="create-notes" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} rows={3} />
                        {form.errors.notes && <div className="mt-1 text-sm text-red-600">{form.errors.notes}</div>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}


