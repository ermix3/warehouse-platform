import AddNewItem from '@/components/shared/add-new-item';
import { DataTable } from '@/components/shared/data-table';
import DeleteItem from '@/components/shared/delete-item';
import { Pagination } from '@/components/shared/pagination';
import AppLayout from '@/layouts/app-layout';
import { destroy } from '@/routes/categories';
import type { BreadcrumbItem } from '@/types';
import { Category, CategoryPagination } from '@/types/category';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createColumns } from './columns';
import CreateCategory from './CreateCategory';
import EditCategory from './EditCategory';

interface PageProps {
    categories: CategoryPagination;
    search: string;
    flash?: { success?: string };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

export default function CategoriesPage() {
    const { categories, search, flash } = usePage<PageProps>().props;

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (category: Category) => {
        setEditCategory(category);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (category: Category) => {
        setDeleteCategory(category);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteCategory) return;

        setIsDeleting(true);
        router.delete(destroy(deleteCategory.id), {
            onSuccess: () => {
                toast.success(`Category "${deleteCategory.name}" deleted successfully`, {
                    description: 'The category has been permanently removed from your system.',
                });
                setShowDeleteDialog(false);
                setDeleteCategory(null);
            },
            onError: () => {
                toast.error('Failed to delete category', {
                    description: 'An error occurred while deleting the category. Please try again.',
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
            setDeleteCategory(null);
        }
    };

    const columns = createColumns(openEditDialog, openDeleteDialog);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />

            <div className="container mt-5 px-5">
                {flash?.success && <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">{flash.success}</div>}

                <AddNewItem title="Categories" description="Manage your categories" buttonLabel="Create Category" onButtonClick={openCreateDialog} />

                <DataTable
                    columns={columns}
                    data={categories.data}
                    searchValue={search}
                    searchPlaceholder="Search categories by name or description..."
                />

                <Pagination links={categories.links} from={categories.from} to={categories.to} total={categories.total} />
            </div>

            {/* Create Dialog */}
            <CreateCategory open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            {/* Edit Dialog */}
            <EditCategory open={showEditDialog} onOpenChange={setShowEditDialog} category={editCategory} />

            {/* Delete Confirmation Dialog */}
            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Delete Category"
                itemName={deleteCategory?.name}
                description="This action cannot be undone."
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
