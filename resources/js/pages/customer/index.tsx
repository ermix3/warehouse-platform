import AddNewItem from '@/components/shared/add-new-item';
import { DataTable } from '@/components/shared/data-table';
import DeleteItem from '@/components/shared/delete-item';
import { Pagination } from '@/components/shared/pagination';
import AppLayout from '@/layouts/app-layout';
import { createColumns } from '@/pages/customer/columns';
import { destroy, index } from '@/routes/customers';
import type { BreadcrumbItem } from '@/types';
import type { Customer, CustomerPagination } from '@/types/customer';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateCustomer from './CreateCustomer';
import EditCustomer from './EditCustomer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: index().url,
    },
];

interface PageProps {
    customers: CustomerPagination;
    search: string;
    flash?: { success?: string };
    [key: string]: unknown;
}

export default function CustomersPage() {
    const { customers, search, flash } = usePage<PageProps>().props;

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
    const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (customer: Customer) => {
        setEditCustomer(customer);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (customer: Customer) => {
        setDeleteCustomer(customer);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteCustomer) return;

        setIsDeleting(true);
        router.delete(destroy(deleteCustomer.id).url, {
            onSuccess: () => {
                toast.success(`Customer "${deleteCustomer.name}" deleted successfully`, {
                    description: 'The customer has been permanently removed from your system.',
                });
                setShowDeleteDialog(false);
                setDeleteCustomer(null);
            },
            onError: () => {
                toast.error('Failed to delete customer', {
                    description: 'An error occurred while deleting the customer. Please try again.',
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
            setDeleteCustomer(null);
        }
    };

    const columns = createColumns(openEditDialog, openDeleteDialog);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />

            <div className="container mt-5 px-5">
                {flash?.success && <div className="alert alert-success">{flash.success}</div>}
                <AddNewItem title="Customers" description="Manage your customers" buttonLabel="Create Customer" onButtonClick={openCreateDialog} />

                <DataTable
                    columns={columns}
                    data={customers.data}
                    searchValue={search}
                    searchPlaceholder="Search customers by name, email, phone, address, or notes..."
                />

                <Pagination links={customers.links} from={customers.from} to={customers.to} total={customers.total} />
            </div>

            {/* Create Dialog */}
            <CreateCustomer open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            {/* Edit Dialog */}
            <EditCustomer open={showEditDialog} onOpenChange={setShowEditDialog} customer={editCustomer} />

            {/* Delete Confirmation Dialog */}
            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Delete Customer"
                itemName={deleteCustomer?.name}
                description="This action cannot be undone."
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
