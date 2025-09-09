import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/categories';
import type { Category } from '@/types/category';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface EditCategoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null;
}

export default function EditCategory({ open, onOpenChange, category }: Readonly<EditCategoryProps>) {
    const form = useForm<{ name: string; description: string }>({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (category) {
            form.setData({
                name: category.name,
                description: category.description ?? '',
            });
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (category) {
            form.put(update(category.id).url, {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="edit-name">Name</Label>
                        <Input id="edit-name" type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        {form.errors.name && <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>}
                    </div>
                    <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea id="edit-description" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                        {form.errors.description && <div className="mt-1 text-sm text-red-600">{form.errors.description}</div>}
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Updating...' : 'Update'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
