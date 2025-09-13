import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeleteItemProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    itemName?: string;
    description?: string;
    isDeleting?: boolean;
    onDelete: () => void;
}

export default function DeleteItem({
    open,
    onOpenChange,
    title,
    itemName,
    description = 'This action cannot be undone.',
    isDeleting = false,
    onDelete,
}: DeleteItemProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <span className="font-semibold">{itemName}</span>?
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
                        {isDeleting && <span className="mr-2">⏳</span>}
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
