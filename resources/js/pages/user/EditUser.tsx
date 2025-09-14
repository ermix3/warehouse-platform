import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update } from '@/routes/users';
import { EditUserProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function EditUser({ open, onOpenChange, user }: Readonly<EditUserProps>) {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const prevUserId = useRef<number | null>(null);

    useEffect(() => {
        if (open && user && user.id !== prevUserId.current) {
            form.setData({
                name: user.name,
                email: user.email,
                password: '',
                password_confirmation: '',
            });
            prevUserId.current = user.id;
        }
        if (!open) {
            form.reset();
            form.clearErrors();
            prevUserId.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, user]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user) {
            form.put(update.url(user.id), {
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
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="edit-name">Name *</Label>
                            <Input
                                id="edit-name"
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Enter user name"
                            />
                            {form.errors.name && <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-email">Email *</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                placeholder="Enter user email"
                            />
                            {form.errors.email && <div className="mt-1 text-sm text-red-600">{form.errors.email}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                placeholder="Enter new password"
                            />
                            {form.errors.password && <div className="mt-1 text-sm text-red-600">{form.errors.password}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-password-confirmation">Confirm New Password</Label>
                            <Input
                                id="edit-password-confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                placeholder="Confirm new password"
                            />
                            {form.errors.password_confirmation && (
                                <div className="mt-1 text-sm text-red-600">{form.errors.password_confirmation}</div>
                            )}
                        </div>
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
