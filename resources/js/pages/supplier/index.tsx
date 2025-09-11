import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { destroy, index } from '@/routes/suppliers';
import type { BreadcrumbItem } from '@/types';
import type { PaginationLink as PaginationLinkType, Supplier, SupplierPagination } from '@/types/supplier';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateSupplier from './CreateSupplier';
import EditSupplier from './EditSupplier';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Suppliers',
        href: index().url,
    },
];

interface PageProps {
    suppliers: SupplierPagination;
    flash?: { success?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { suppliers, flash } = usePage<PageProps>().props;

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
    const [deleteSupplier, setDeleteSupplier] = useState<Supplier | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (supplier: Supplier) => {
        setEditSupplier(supplier);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (supplier: Supplier) => {
        setDeleteSupplier(supplier);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteSupplier) return;

        setIsDeleting(true);
        router.delete(destroy(deleteSupplier.id).url, {
            onSuccess: () => {
                toast.success(`Supplier "${deleteSupplier.name}" deleted successfully`, {
                    description: 'The supplier has been permanently removed from your system.',
                });
                setShowDeleteDialog(false);
                setDeleteSupplier(null);
            },
            onError: () => {
                toast.error('Failed to delete supplier', {
                    description: 'An error occurred while deleting the supplier. Please try again.',
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
            setDeleteSupplier(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />
            <div className="container mt-5 px-5">
                {flash?.success && <div className="alert alert-success">{flash.success}</div>}
                <Button onClick={openCreateDialog} className="mb-3">
                    Create Supplier
                </Button>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {suppliers.data.map((supplier: Supplier) => (
                            <TableRow key={supplier.id}>
                                <TableCell>{supplier.id}</TableCell>
                                <TableCell>{supplier.name}</TableCell>
                                <TableCell>{supplier.email || '-'}</TableCell>
                                <TableCell>{supplier.phone || '-'}</TableCell>
                                <TableCell>{supplier.address ? supplier.address.substring(0, 50) + '...' : '-'}</TableCell>
                                <TableCell>
                                    <Button onClick={() => openEditDialog(supplier)} variant="outline" size="sm" className="mx-2">
                                        Edit
                                    </Button>
                                    <Button onClick={() => openDeleteDialog(supplier)} variant="destructive" size="sm">
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
                        {suppliers.links?.map((link: PaginationLinkType) => {
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
            <CreateSupplier open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            {/* Edit Dialog */}
            <EditSupplier open={showEditDialog} onOpenChange={setShowEditDialog} supplier={editSupplier} />

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={closeDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Supplier</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete the supplier <span className="font-semibold">{deleteSupplier?.name}</span>?
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
