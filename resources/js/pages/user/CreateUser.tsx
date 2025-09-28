import { FileInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '@/routes/users';
import { CreateUserProps, UserRequest } from '@/types';
import { useForm } from '@inertiajs/react';
import { Asterisk, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

export default function CreateUser({ open, onOpenChange }: Readonly<CreateUserProps>) {
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, reset, clearErrors, post, processing, errors } = useForm<UserRequest>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(store.url(), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
            onError: (error) => {
                console.log('CreateUser - handleSubmit => Error ', error);
            },
        });
    };

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            clearErrors();
            setPreview(null);
        }
        onOpenChange(isOpen);
    };

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

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[65vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>
                        Fill in the user details.
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="create-name">
                                Name
                                <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-name"
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
                            <Label htmlFor="create-email">
                                Email
                                <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-email"
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
                            <Label htmlFor="create-password">
                                Password
                                <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter password"
                                className={errors.password ? 'border-red-500' : ''}
                                required
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <Label htmlFor="create-password-confirm">
                                Confirm Password
                                <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-password-confirm"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm password"
                                className={errors.password_confirmation ? 'border-red-500' : ''}
                                required
                            />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>}
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
                                Create
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
