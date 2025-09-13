import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '@/routes/users';
import { useForm } from '@inertiajs/react';

interface CreateUserProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateUser({ open, onOpenChange }: Readonly<CreateUserProps>) {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post(store.url(), {
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
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="create-name">Name *</Label>
                            <Input
                                id="create-name"
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Enter user name"
                            />
                            {form.errors.name && <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-email">Email *</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                placeholder="Enter user email"
                            />
                            {form.errors.email && <div className="mt-1 text-sm text-red-600">{form.errors.email}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-password">Password *</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                placeholder="Enter password"
                            />
                            {form.errors.password && <div className="mt-1 text-sm text-red-600">{form.errors.password}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-password-confirmation">Confirm Password *</Label>
                            <Input
                                id="create-password-confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                placeholder="Confirm password"
                            />
                            {form.errors.password_confirmation && (
                                <div className="mt-1 text-sm text-red-600">{form.errors.password_confirmation}</div>
                            )}
                        </div>
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
