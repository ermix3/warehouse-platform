import { DataTable, DeleteItem, Pagination, TitleActionsSection } from '@/components/shared';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy, exportData, index } from '@/routes/shipments';
import { BreadcrumbItem, PageShipmentProps, Shipment } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { createColumns } from './columns';
import CreateShipment from './CreateShipment';
import EditShipment from './EditShipment';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
    {
        title: 'Shipments',
        href: index.url(),
    },
    {
        title: 'Listing all shipments',
        href: '',
    },
];

export default function ShipmentsPage() {
    const { shipments, filters, flash } = usePage<PageShipmentProps>().props;

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editShipment, setEditShipment] = useState<Shipment | null>(null);
    const [deleteShipment, setDeleteShipment] = useState<Shipment | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (shipment: Shipment) => {
        setEditShipment(shipment);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (shipment: Shipment) => {
        setDeleteShipment(shipment);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteShipment) return;

        setIsDeleting(true);
        router.delete(destroy(deleteShipment.id).url, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeleteShipment(null);
            },
            onError: (error) => {
                console.error('Failed to delete shipment: ', error);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false);
            setDeleteShipment(null);
        }
    };

    const columns = createColumns(openEditDialog, openDeleteDialog);

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Shipments" />

            <div className="container mt-5 px-5">
                <TitleActionsSection
                    title="Shipments"
                    description="Manage your shipment records and track order deliveries"
                    btnAddLabel="Create Shipment"
                    onBtnAddClick={openCreateDialog}
                    onBtnExportClick={(type) => {
                        const q = { type, search: filters.search, sort_by: filters.sort_by, sort_order: filters.sort_order };
                        window.location.href = exportData.url({ query: q });
                    }}
                />

                <DataTable
                    columns={columns}
                    data={shipments.data}
                    filters={filters}
                    searchPlaceholder="Search shipments by tracking number, carrier, or status..."
                />

                <Pagination links={shipments.links} from={shipments.from} to={shipments.to} total={shipments.total} />
            </div>

            {/* Create Dialog */}
            <CreateShipment open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            {/* Edit Dialog */}
            <EditShipment open={showEditDialog} onOpenChange={setShowEditDialog} shipment={editShipment} />

            {/* Delete Confirmation Dialog */}
            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Delete Shipment"
                itemName={deleteShipment?.tracking_number || `#${deleteShipment?.id}`}
                description={
                    deleteShipment?.orders_count
                        ? `This shipment has ${deleteShipment.orders_count} associated orders. Deleting it may affect these orders.`
                        : 'This action cannot be undone.'
                }
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
