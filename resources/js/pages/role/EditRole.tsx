import { CustomMultiSelect } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPermissionsOptions } from '@/lib/utils';
import { update } from '@/routes/roles';
import { EditRoleProps, RoleRequest } from '@/types';
import { useForm } from '@inertiajs/react';
import { Asterisk, Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

export default function EditRole({ open, onOpenChange, role, permissions }: Readonly<EditRoleProps>) {
    const { data, setData, put, reset, clearErrors, errors, processing } = useForm<RoleRequest>({
        name: role?.name || '',
        permissions: role?.permissions?.map((p) => p.name) || [],
    });

    useEffect(() => {
        if (role) {
            setData({
                name: role.name,
                permissions: role.permissions?.map((p) => p.name) || [],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!role) return;

        put(update(role.id).url, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
            onError: (error) => {
                console.log('EditRole - handleSubmit => Error ', error);
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

    if (!role) return null;

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[85vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Edit Role: {role.name}</DialogTitle>
                    <DialogDescription>
                        Update the role details.{' '}
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="max-h-[calc(85vh-2rem)] space-y-3 overflow-y-auto p-5">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="edit-name">
                                Role Name <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input id="edit-name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
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

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-5 py-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => handleDialogChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className={'cursor-pointer px-6'}>
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {processing ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
