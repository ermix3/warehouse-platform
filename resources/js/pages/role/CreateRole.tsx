import { CustomMultiSelect } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPermissionsOptions } from '@/lib/utils';
import { index } from '@/routes/roles';
import { CreateRoleProps, RoleRequest } from '@/types';
import { useForm } from '@inertiajs/react';
import { Asterisk, Loader2 } from 'lucide-react';
import React from 'react';

export default function CreateRole({ open, onOpenChange, permissions }: Readonly<CreateRoleProps>) {
    const { post, setData, reset, clearErrors, data, errors, processing } = useForm<RoleRequest>({
        name: '',
        permissions: [],
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(index.url(), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
            onError: (error) => {
                console.log('CreateRole - handleSubmit => Error ', error);
            },
        });
    };

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[85vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Create Role</DialogTitle>
                    <DialogDescription>
                        Fill in the role details.{' '}
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />} are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="max-h-[calc(85vh-2rem)] space-y-3 overflow-y-auto p-5">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="create-name">
                                Role Name <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-name"
                                type="text"
                                placeholder="e.g., admin, manager"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                        </div>

                        <div className="">
                            <Label>
                                Permissions <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <CustomMultiSelect
                                values={data.permissions}
                                onValuesChange={(values) => setData('permissions', values)}
                                items={getPermissionsOptions(permissions)}
                            />
                            {errors.permissions && (
                                <p className="mt-1 text-sm text-red-500">
                                    {Array.isArray(errors.permissions) ? errors.permissions.join(', ') : (errors.permissions as string)}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-6 py-3">
                        <Button type="button" variant="outline" onClick={() => handleDialogChange(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {processing ? 'Creating...' : 'Create Role'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
