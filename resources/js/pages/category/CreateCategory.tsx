import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/categories';
import { useForm } from '@inertiajs/react';

interface CreateCategoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateCategory({ open, onOpenChange }: Readonly<CreateCategoryProps>) {
    const form = useForm<{ name: string; description: string }>({
        name: '',
        description: '',
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="create-name">Name</Label>
                        <Input id="create-name" type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        {form.errors.name && <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>}
                    </div>
                    <div>
                        <Label htmlFor="create-description">Description</Label>
                        <Textarea
                            id="create-description"
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                        />
                        {form.errors.description && <div className="mt-1 text-sm text-red-600">{form.errors.description}</div>}
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Creating...' : 'Create'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
