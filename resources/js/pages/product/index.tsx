import AddNewItem from '@/components/shared/add-new-item';
import { DataTable } from '@/components/shared/data-table';
import DeleteItem from '@/components/shared/delete-item';
import { Pagination } from '@/components/shared/pagination';
import AppLayout from '@/layouts/app-layout';
import { destroy } from '@/routes/products';
import type { BreadcrumbItem } from '@/types';
import { Category } from '@/types/category';
import { Product, ProductPagination } from '@/types/product';
import { Supplier } from '@/types/supplier';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createColumns } from './columns';
import CreateProduct from './CreateProduct';
import EditProduct from './EditProduct';

interface PageProps {
    products: ProductPagination;
    categories: Category[];
    suppliers: Supplier[];
    search: string;
    flash?: { success?: string };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

export default function ProductsPage() {
    const { products, categories, suppliers, search, flash } = usePage<PageProps>().props;

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (product: Product) => {
        setEditProduct(product);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (product: Product) => {
        setDeleteProduct(product);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteProduct) return;

        setIsDeleting(true);
        router.delete(destroy(deleteProduct.id), {
            onSuccess: () => {
                toast.success(`Product "${deleteProduct.name}" deleted successfully`, {
                    description: 'The product has been permanently removed from your system.',
                });
                setShowDeleteDialog(false);
                setDeleteProduct(null);
            },
            onError: () => {
                toast.error('Failed to delete product', {
                    description: 'An error occurred while deleting the product. Please try again.',
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
            setDeleteProduct(null);
        }
    };

    const columns = createColumns(openEditDialog, openDeleteDialog);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="container mt-5 px-5">
                {flash?.success && <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">{flash.success}</div>}

                <AddNewItem
                    title="Products"
                    description="Manage your product inventory"
                    buttonLabel="Create Product"
                    onButtonClick={openCreateDialog}
                />

                <DataTable
                    columns={columns}
                    data={products.data}
                    searchValue={search}
                    searchPlaceholder="Search products by barcode, name, origin, HS code, or description..."
                />

                <Pagination links={products.links} from={products.from} to={products.to} total={products.total} />
            </div>

            {/* Create Dialog */}
            <CreateProduct open={showCreateDialog} onOpenChange={setShowCreateDialog} categories={categories} suppliers={suppliers} />

            {/* Edit Dialog */}
            <EditProduct open={showEditDialog} onOpenChange={setShowEditDialog} product={editProduct} categories={categories} suppliers={suppliers} />

            {/* Delete Confirmation Dialog */}
            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Delete Product"
                itemName={deleteProduct?.name}
                description="This action cannot be undone."
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
