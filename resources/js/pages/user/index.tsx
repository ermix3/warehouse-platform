import { AddNewItem, DataTable, DeleteItem, Pagination } from '@/components/shared/';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy, index } from '@/routes/users';
import { BreadcrumbItem, PageUserProps, User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { createColumns } from './columns';
import CreateUser from './CreateUser';
import EditUser from './EditUser';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
    {
        title: 'Users',
        href: index.url(),
    },
    {
        title: 'Listing all users',
        href: '',
    },
];

export default function UsersPage() {
    const { users, filters, flash } = usePage<PageUserProps>().props;

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (user: User) => {
        setEditUser(user);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (user: User) => {
        setDeleteUser(user);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteUser) return;

        setIsDeleting(true);
        router.delete(destroy(deleteUser.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeleteUser(null);
            },
            onError: (error) => {
                console.error('Failed to delete user: ', error);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false);
            setDeleteUser(null);
        }
    };

    const columns = createColumns(openEditDialog, openDeleteDialog);

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Users" />

            <div className="container mt-5 px-5">
                <AddNewItem title="Users" description="Manage your users" buttonLabel="Create User" onButtonClick={openCreateDialog} />

                <DataTable columns={columns} data={users.data} filters={filters} searchPlaceholder="Search users by name or email..." />

                <Pagination links={users.links} from={users.from} to={users.to} total={users.total} />
            </div>

            {/* Create Dialog */}
            <CreateUser open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            {/* Edit Dialog */}
            <EditUser open={showEditDialog} onOpenChange={setShowEditDialog} user={editUser} />

            {/* Delete Confirmation Dialog */}
            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Delete User"
                itemName={deleteUser?.name}
                description="This action cannot be undone."
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
