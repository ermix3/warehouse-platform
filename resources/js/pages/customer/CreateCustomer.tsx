import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/customers';
import { useForm } from '@inertiajs/react';

interface CreateCustomerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateCustomer({ open, onOpenChange }: Readonly<CreateCustomerProps>) {
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post(store().url, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="create-name">Name *</Label>
                        <Input id="create-name" type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required />
                        {form.errors.name && <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>}
                    </div>

                    <div>
                        <Label htmlFor="create-email">Email</Label>
                        <Input id="create-email" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                        {form.errors.email && <div className="mt-1 text-sm text-red-600">{form.errors.email}</div>}
                    </div>

                    <div>
                        <Label htmlFor="create-phone">Phone</Label>
                        <Input id="create-phone" type="tel" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                        {form.errors.phone && <div className="mt-1 text-sm text-red-600">{form.errors.phone}</div>}
                    </div>

                    <div>
                        <Label htmlFor="create-address">Address</Label>
                        <Textarea id="create-address" value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} rows={3} />
                        {form.errors.address && <div className="mt-1 text-sm text-red-600">{form.errors.address}</div>}
                    </div>

                    <div>
                        <Label htmlFor="create-notes">Notes</Label>
                        <Textarea id="create-notes" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} rows={3} />
                        {form.errors.notes && <div className="mt-1 text-sm text-red-600">{form.errors.notes}</div>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
