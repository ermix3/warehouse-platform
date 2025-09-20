import { DataTable, DeleteItem, Pagination, TitleActionsSection } from '@/components/shared';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy, index } from '@/routes/orders';
import { BreadcrumbItem, Order, PageOrderProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { createColumns } from './columns';
import CreateOrder from './CreateOrder';
import EditOrder from './EditOrder';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Orders',
        href: index().url,
    },
    {
        title: 'Listing all orders',
        href: '',
    },
];

export default function OrdersPage() {
    const { orders, customers, shipments, products, filters, flash } = usePage<PageOrderProps>().props;

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (order: Order) => {
        setEditOrder(order);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (order: Order) => {
        setDeleteOrder(order);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteOrder) return;

        setIsDeleting(true);
        router.delete(destroy(deleteOrder.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeleteOrder(null);
            },
            onError: (error) => {
                console.error('Failed to delete order: ', error);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false);
            setDeleteOrder(null);
        }
    };

    const columns = createColumns(openEditDialog, openDeleteDialog);

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Orders" />

            <div className="container mt-5 px-5">
                <TitleActionsSection
                    title="Orders"
                    description="Manage your orders records"
                    btnAddLabel="Create Order"
                    onBtnAddClick={openCreateDialog}
                />

                <DataTable
                    columns={columns}
                    data={orders.data}
                    filters={filters}
                    searchPlaceholder="Search orders by order number, customer name, or status..."
                />

                <Pagination links={orders.links} from={orders.from} to={orders.to} total={orders.total} />
            </div>

            <CreateOrder open={showCreateDialog} onOpenChange={setShowCreateDialog} customers={customers} shipments={shipments} products={products} />

            <EditOrder
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                order={editOrder}
                customers={customers}
                shipments={shipments}
                products={products}
            />

            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Delete Order"
                itemName={deleteOrder?.order_number}
                description="Are you sure you want to delete this order? This action cannot be undone."
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
