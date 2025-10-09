import { DataTable, DeleteItem, Pagination, TitleActionsSection } from '@/components/shared';
import { ActionsEnum, ResourcesEnum } from '@/enums';
import { usePermission } from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy } from '@/routes/roles';
import { BreadcrumbItem, PageRoleProps, Role } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { createColumns } from './columns';
import CreateRole from './CreateRole';
import EditRole from './EditRole';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Listing all roles',
        href: '',
    },
];

export default function RolesPage() {
    const { roles, permissions, filters, flash } = usePage<PageRoleProps>().props;

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editRole, setEditRole] = useState<Role | null>(null);
    const [deleteRole, setDeleteRole] = useState<Role | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (role: Role) => {
        setEditRole(role);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (role: Role) => {
        setDeleteRole(role);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteRole) return;

        setIsDeleting(true);
        router.delete(destroy(deleteRole.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeleteRole(null);
            },
            onError: (error) => {
                console.error('Failed to delete role: ', error);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false);
            setDeleteRole(null);
        }
    };

    const { hasPermission } = usePermission();
    const canAdd = hasPermission(ActionsEnum.CREATE, ResourcesEnum.ROLES);
    const canEdit = hasPermission(ActionsEnum.EDIT, ResourcesEnum.ROLES);
    const canDelete = hasPermission(ActionsEnum.DELETE, ResourcesEnum.ROLES);

    const columns = createColumns(openEditDialog, openDeleteDialog, canEdit, canDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Roles" />

            <div className="container mt-5 px-5">
                <TitleActionsSection
                    title="Roles"
                    description="Manage user roles and permissions"
                    btnAddLabel="Create Role"
                    onBtnAddClick={openCreateDialog}
                    canAdd={canAdd}
                />

                <DataTable columns={columns} data={roles.data} filters={filters} searchPlaceholder="Search roles..." />

                <Pagination links={roles.links} from={roles.from} to={roles.to} total={roles.total} />
            </div>

            <CreateRole open={showCreateDialog} onOpenChange={setShowCreateDialog} permissions={permissions} />

            {editRole && (
                <EditRole
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                    role={editRole}
                    permissions={permissions}
                    key={`edit-role-${editRole.id}`}
                />
            )}

            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Delete Role"
                itemName={deleteRole?.name}
                description={`Are you sure you want to delete "${deleteRole?.name}"? This action cannot be undone.`}
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
