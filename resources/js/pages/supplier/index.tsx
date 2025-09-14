import { AddNewItem, DataTable, DeleteItem, Pagination } from '@/components/shared';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy, index } from '@/routes/suppliers';
import { BreadcrumbItem, PageSupplierProps, Supplier } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createColumns } from './columns';
import CreateSupplier from './CreateSupplier';
import EditSupplier from './EditSupplier';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
    {
        title: 'Suppliers',
        href: index().url,
    },
    {
        title: 'Listing all suppliers',
        href: '',
    },
];

export default function Index() {
    const { suppliers, search, flash } = usePage<PageSupplierProps>().props;

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

    const columns = createColumns(openEditDialog, openDeleteDialog);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />

            <div className="container mt-5 px-5">
                {flash?.success && <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">{flash.success}</div>}

                <AddNewItem title="Suppliers" description="Manage your suppliers" buttonLabel="Create Supplier" onButtonClick={openCreateDialog} />

                <DataTable
                    columns={columns}
                    data={suppliers.data}
                    searchValue={search}
                    searchPlaceholder="Search suppliers by name, email, phone, address, or notes..."
                />

                <Pagination links={suppliers.links} from={suppliers.from} to={suppliers.to} total={suppliers.total} />
            </div>

            {/* Create Dialog */}
            <CreateSupplier open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            {/* Edit Dialog */}
            <EditSupplier open={showEditDialog} onOpenChange={setShowEditDialog} supplier={editSupplier} />

            {/* Delete Confirmation Dialog */}
            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Delete Supplier"
                itemName={deleteSupplier?.name}
                description="This action cannot be undone."
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
