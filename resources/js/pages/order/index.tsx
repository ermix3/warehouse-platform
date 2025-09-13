import AddNewItem from '@/components/shared/add-new-item';
import { DataTable } from '@/components/shared/data-table';
import DeleteItem from '@/components/shared/delete-item';
import { Pagination } from '@/components/shared/pagination';
import AppLayout from '@/layouts/app-layout';
import { createColumns } from '@/pages/order/columns';
import { destroy, index } from '@/routes/orders';
import type { BreadcrumbItem } from '@/types';
import type { Order, OrderPagination } from '@/types/order';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateOrder from './CreateOrder';
import EditOrder from './EditOrder';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: index().url,
    },
];

interface PageProps {
    orders: OrderPagination;
    customers: { id: number; name: string }[];
    shippings: { id: number; tracking_number?: string; carrier?: string }[];
    search: string;
    flash?: { success?: string };
    [key: string]: unknown;
}

export default function OrdersPage() {
    const { orders, customers, shippings, search, flash } = usePage<PageProps>().props;

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
                toast.success(`Order "${deleteOrder.order_number}" deleted successfully`, {
                    description: 'The order has been permanently removed from your system.',
                });
                setShowDeleteDialog(false);
                setDeleteOrder(null);
            },
            onError: () => {
                toast.error('Failed to delete order', {
                    description: 'An error occurred while deleting the order. Please try again.',
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
            setDeleteOrder(null);
        }
    };

    const columns = createColumns(openEditDialog, openDeleteDialog);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <div className="container mt-5 px-5">
                {flash?.success && <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">{flash.success}</div>}

                <AddNewItem title="Orders" description="Manage your orders" buttonLabel="Create Order" onButtonClick={openCreateDialog} />

                <DataTable
                    columns={columns}
                    data={orders.data}
                    searchValue={search}
                    searchPlaceholder="Search orders by order number, customer name, or status..."
                />

                <Pagination links={orders.links} from={orders.from} to={orders.to} total={orders.total} />
            </div>

            <CreateOrder open={showCreateDialog} onOpenChange={setShowCreateDialog} customers={customers} shippings={shippings} />

            <EditOrder open={showEditDialog} onOpenChange={setShowEditDialog} order={editOrder} customers={customers} shippings={shippings} />

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
