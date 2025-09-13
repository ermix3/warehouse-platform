import AddNewItem from '@/components/shared/add-new-item';
import { DataTable } from '@/components/shared/data-table';
import DeleteItem from '@/components/shared/delete-item';
import { Pagination } from '@/components/shared/pagination';
import AppLayout from '@/layouts/app-layout';
import { destroy } from '@/routes/shippings';
import type { BreadcrumbItem } from '@/types';
import { Shipping, ShippingPagination } from '@/types/shipping';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createColumns } from './columns';
import CreateShipping from './CreateShipping';
import EditShipping from './EditShipping';

interface PageProps {
    shippings: ShippingPagination;
    search: string;
    flash?: { success?: string };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shippings',
        href: '/shippings',
    },
];

export default function ShippingsPage() {
    const { shippings, search, flash } = usePage<PageProps>().props;

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editShipping, setEditShipping] = useState<Shipping | null>(null);
    const [deleteShipping, setDeleteShipping] = useState<Shipping | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (shipping: Shipping) => {
        setEditShipping(shipping);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (shipping: Shipping) => {
        setDeleteShipping(shipping);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteShipping) return;

        setIsDeleting(true);
        router.delete(destroy(deleteShipping.id).url, {
            onSuccess: () => {
                toast.success(`Shipping #${deleteShipping.id} deleted successfully`);
                setShowDeleteDialog(false);
                setDeleteShipping(null);
            },
            onError: () => {
                toast.error('Failed to delete shipping');
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false);
            setDeleteShipping(null);
        }
    };

    const columns = createColumns(openEditDialog, openDeleteDialog);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shippings" />

            <div className="container mt-5 px-5">
                {flash?.success && <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">{flash.success}</div>}

                <AddNewItem title="Shippings" description="Manage your shipping records" buttonLabel="Create Shipping" onButtonClick={openCreateDialog} />

                <DataTable columns={columns} data={shippings.data} searchValue={search} searchPlaceholder="Search shippings by tracking number, carrier, or status..." />

                <Pagination links={shippings.links} from={shippings.from} to={shippings.to} total={shippings.total} />
            </div>

            {/* Create Dialog */}
            <CreateShipping open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            {/* Edit Dialog */}
            <EditShipping open={showEditDialog} onOpenChange={setShowEditDialog} shipping={editShipping} />

            {/* Delete Confirmation Dialog */}
            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Delete Shipping"
                itemName={deleteShipping?.tracking_number || `#${deleteShipping?.id}`}
                description="This action cannot be undone."
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}


