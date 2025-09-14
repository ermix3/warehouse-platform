import { AddNewItem, DataTable, DeleteItem, Pagination } from '@/components/shared';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy, index } from '@/routes/shippings';
import { BreadcrumbItem, PageShippingProps, Shipping } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { createColumns } from './columns';
import CreateShipping from './CreateShipping';
import EditShipping from './EditShipping';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
    {
        title: 'Shippings',
        href: index.url(),
    },
    {
        title: 'Listing all shippings',
        href: '',
    },
];

export default function ShippingsPage() {
    const { shippings, filters, flash } = usePage<PageShippingProps>().props;

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
                setShowDeleteDialog(false);
                setDeleteShipping(null);
            },
            onError: (error) => {
                console.error('Failed to delete shipping: ', error);
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
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Shippings" />

            <div className="container mt-5 px-5">
                <AddNewItem
                    title="Shippings"
                    description="Manage your shipping records and track order deliveries"
                    buttonLabel="Create Shipping"
                    onButtonClick={openCreateDialog}
                />

                <DataTable
                    columns={columns}
                    data={shippings.data}
                    filters={filters}
                    searchPlaceholder="Search shippings by tracking number, carrier, or status..."
                />

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
                description={
                    deleteShipping?.orders_count
                        ? `This shipping has ${deleteShipping.orders_count} associated orders. Deleting it may affect these orders.`
                        : 'This action cannot be undone.'
                }
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
