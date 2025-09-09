import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { destroy, index } from '@/routes/categories';
import type { BreadcrumbItem } from '@/types';
import type { Category, CategoryPagination, PaginationLink as PaginationLinkType } from '@/types/category';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateCategory from './CreateCategory';
import EditCategory from './EditCategory';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: index().url,
    },
];

interface PageProps {
    categories: CategoryPagination;
    flash?: { success?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { categories, flash } = usePage<PageProps>().props;

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (category: Category) => {
        setEditCategory(category);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (category: Category) => {
        setDeleteCategory(category);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteCategory) return;

        setIsDeleting(true);
        router.delete(destroy(deleteCategory.id).url, {
            onSuccess: () => {
                toast.success(`Category "${deleteCategory.name}" deleted successfully`, {
                    description: 'The category has been permanently removed from your system.',
                });
                setShowDeleteDialog(false);
                setDeleteCategory(null);
            },
            onError: () => {
                toast.error('Failed to delete category', {
                    description: 'An error occurred while deleting the category. Please try again.',
                });
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false);
            setDeleteCategory(null);
        }
    };
    console.log(categories, flash);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="container mt-5 px-5">
                {flash?.success && <div className="alert alert-success">{flash.success}</div>}
                <Button onClick={openCreateDialog} className="mb-3">
                    Create Category
                </Button>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.data.map((category: Category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    <Button onClick={() => openEditDialog(category)} variant="outline" size="sm" className="mx-2">
                                        Edit
                                    </Button>
                                    <Button onClick={() => openDeleteDialog(category)} variant="destructive" size="sm">
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination links using Shadcn UI */}
                <Pagination className="mt-4">
                    <PaginationContent>
                        {categories.links?.map((link: PaginationLinkType) => {
                            if (link.label.includes('Previous')) {
                                return (
                                    <PaginationItem key={link.label + link.page}>
                                        <PaginationPrevious href={link.url || undefined} preserveScroll aria-disabled={!link.url} />
                                    </PaginationItem>
                                );
                            }
                            if (link.label.includes('Next')) {
                                return (
                                    <PaginationItem key={link.label + link.page}>
                                        <PaginationNext href={link.url || undefined} preserveScroll aria-disabled={!link.url} />
                                    </PaginationItem>
                                );
                            }
                            if (link.label === '...') {
                                return (
                                    <PaginationItem key={link.label + String(link.page)}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }
                            return (
                                <PaginationItem key={link.label + link.page}>
                                    <PaginationLink
                                        href={link.url || undefined}
                                        isActive={link.active}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </PaginationItem>
                            );
                        })}
                    </PaginationContent>
                </Pagination>
            </div>

            {/* Create Dialog */}
            <CreateCategory open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            {/* Edit Dialog */}
            <EditCategory open={showEditDialog} onOpenChange={setShowEditDialog} category={editCategory} />

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={closeDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete the category <span className="font-semibold">{deleteCategory?.name}</span>?
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone.</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={closeDeleteDialog} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting && <span className="mr-2">⏳</span>}
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
