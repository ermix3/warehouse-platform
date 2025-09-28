import { FileInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update } from '@/routes/users';
import { EditUserProps, UserRequest } from '@/types';
import { useForm } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Asterisk, Loader2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function EditUser({ open, onOpenChange, user }: Readonly<EditUserProps>) {
    const [preview, setPreview] = useState<string | null>(null);
    const { data, setData, reset, clearErrors, put, processing, errors } = useForm<UserRequest>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null,
    });
    const prevUserId = useRef<number | null>(null);

    useEffect(() => {
        if (open && user && user.id !== prevUserId.current) {
            setData({
                name: user.name,
                email: user.email,
                password: '',
                password_confirmation: '',
                avatar: user.avatar_url,
            });
            if (user.avatar_url) {
                setPreview(user.avatar_url);
            }
            prevUserId.current = user.id;
        }
        if (!open) {
            reset();
            clearErrors();
            setPreview(null);
            prevUserId.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, user]);

    const handleFileChange = (file: File | null) => {
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setData('avatar', null);
            setPreview(null);
        }
    };

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            clearErrors();
            setPreview(null);
        }
        onOpenChange(isOpen);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user) {
            put(update.url(user.id), {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (error) => {
                    console.log('EditUser - handleSubmit => Error ', error);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[65vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update the user details.
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="edit-name">
                                Name
                                <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter user name"
                                className={errors.name ? 'border-red-500' : ''}
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="edit-email">
                                Email
                                <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter user email"
                                className={errors.email ? 'border-red-500' : ''}
                                required
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter new password"
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <Label htmlFor="edit-password-confirmation">Confirm New Password</Label>
                            <Input
                                id="edit-password-confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center px-5">
                        <div className="w-full">
                            <Label htmlFor="avatar" className="mb-1 block text-sm font-bold text-gray-700">
                                Profile Photo
                            </Label>
                            <FileInput id="avatar" accept="image/*" onChange={handleFileChange} preview={preview} className="h-full w-full" />
                            {errors.avatar && <p className="mt-1 text-sm text-red-500">{errors.avatar as string}</p>}
                        </div>
                    </div>

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-5 py-3">
                        <Button type="button" variant="outline" onClick={() => handleDialogChange(false)} disabled={processing}>
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
