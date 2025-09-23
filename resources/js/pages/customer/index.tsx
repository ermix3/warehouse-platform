import { DataTable, DeleteItem, Pagination, TitleActionsSection } from '@/components/shared';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy, index } from '@/routes/customers';
import { BreadcrumbItem, Customer, PageCustomerProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { createColumns } from './columns';
import CreateCustomer from './CreateCustomer';
import EditCustomer from './EditCustomer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
    {
        title: 'Customers',
        href: index().url,
    },
    {
        title: 'Listing all customers',
        href: '',
    },
];

export default function CustomersPage() {
    const { customers, filters, flash } = usePage<PageCustomerProps>().props;

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
                setShowDeleteDialog(false);
                setDeleteCustomer(null);
            },
            onError: (error) => {
                console.error('Failed to delete customer: ', error);
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
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Customers" />

            <div className="container mt-5 px-5">
                {flash?.success && <div className="alert alert-success">{flash.success}</div>}
                <TitleActionsSection
                    title="Customers"
                    description="Manage your customers"
                    btnAddLabel="Create Customer"
                    onBtnAddClick={openCreateDialog}
                />

                <DataTable
                    columns={columns}
                    data={customers.data}
                    filters={filters}
                    searchPlaceholder="Search customers by name, email, phone, address, or notes..."
                    colsVisibility={{
                        address: false,
                        notes: false,
                    }}
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
