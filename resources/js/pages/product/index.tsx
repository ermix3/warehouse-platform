import { DataTable, DeleteItem, Pagination, TitleActionsSection } from '@/components/shared';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy } from '@/routes/products';
import { BreadcrumbItem, PageProductProps, Product } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { createColumns } from './columns';
import CreateProduct from './CreateProduct';
import EditProduct from './EditProduct';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Listing all products',
        href: '',
    },
];

export default function ProductsPage() {
    const { products, filters, flash } = usePage<PageProductProps>().props;

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
                setShowDeleteDialog(false);
                setDeleteProduct(null);
            },
            onError: (error) => {
                console.error('Failed to delete product: ', error);
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
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Products" />

            <div className="container mt-5 px-5">
                <TitleActionsSection
                    title="Products"
                    description="Manage your product inventory"
                    btnAddLabel="Create Product"
                    onBtnAddClick={openCreateDialog}
                />

                <DataTable
                    columns={columns}
                    data={products.data}
                    filters={filters}
                    searchPlaceholder="Search products by barcode, name, origin, HS code, or description..."
                />

                <Pagination links={products.links} from={products.from} to={products.to} total={products.total} />
            </div>

            {/* Create Dialog */}
            <CreateProduct open={showCreateDialog} onOpenChange={setShowCreateDialog} />

            {/* Edit Dialog */}
            <EditProduct open={showEditDialog} onOpenChange={setShowEditDialog} product={editProduct} />

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
