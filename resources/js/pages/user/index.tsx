import AddNewItem from '@/components/shared/add-new-item';
import { DataTable } from '@/components/shared/data-table';
import DeleteItem from '@/components/shared/delete-item';
import { Pagination } from '@/components/shared/pagination';
import AppLayout from '@/layouts/app-layout';
import { destroy } from '@/routes/users';
import type { BreadcrumbItem } from '@/types';
import { User, UserPagination } from '@/types/user';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createColumns } from './columns';
import CreateUser from './CreateUser';
import EditUser from './EditUser';

interface PageProps {
    users: UserPagination;
    search: string;
    flash?: { success?: string };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function UsersPage() {
    const { users, search, flash } = usePage<PageProps>().props;

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
                toast.success(`User "${deleteUser.name}" deleted successfully`, {
                    description: 'The user has been permanently removed from your system.',
                });
                setShowDeleteDialog(false);
                setDeleteUser(null);
            },
            onError: () => {
                toast.error('Failed to delete user', {
                    description: 'An error occurred while deleting the user. Please try again.',
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
            setDeleteUser(null);
        }
    };

    const columns = createColumns(openEditDialog, openDeleteDialog);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="container mt-5 px-5">
                {flash?.success && <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">{flash.success}</div>}

                <AddNewItem title="Users" description="Manage your users" buttonLabel="Create User" onButtonClick={openCreateDialog} />

                <DataTable
                    columns={columns}
                    data={users.data}
                    searchValue={search}
                    searchPlaceholder="Search users by name or email..."
                />

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
