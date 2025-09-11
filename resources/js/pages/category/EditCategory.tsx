import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@/types/category';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

interface EditCategoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null;
}

export default function EditCategory({ open, onOpenChange, category }: Readonly<EditCategoryProps>) {
    const form = useForm({
        name: '',
        description: '',
    });
    const prevCategoryId = useRef<number | null>(null);

    useEffect(() => {
        if (open && category && category.id !== prevCategoryId.current) {
            form.setData({
                name: category.name,
                description: category.description ?? '',
            });
            prevCategoryId.current = category.id;
        }
        if (!open) {
            form.reset();
            form.clearErrors();
            prevCategoryId.current = null;
        }
    }, [open, category]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (category) {
            form.put(`/categories/${category.id}`, {
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
                    <DialogTitle>Edit Category</DialogTitle>
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
                                placeholder="Enter category name"
                            />
                            {form.errors.name && <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                placeholder="Enter category description"
                                rows={3}
                            />
                            {form.errors.description && <div className="mt-1 text-sm text-red-600">{form.errors.description}</div>}
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
