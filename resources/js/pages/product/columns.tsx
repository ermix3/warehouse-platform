'use client';

import ActionsCell from '@/components/shared/actions-cell';
import { Product } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';

export const createColumns = (onEdit: (product: Product) => void, onDelete: (product: Product) => void): ColumnDef<Product>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false,
    },
    {
        accessorKey: 'barcode',
        header: 'Barcode',
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'origin',
        header: 'Origin',
    },
    {
        accessorKey: 'hs_code',
        header: 'HS Code',
    },
    {
        accessorKey: 'net_weight',
        header: 'Net Weight',
        cell: ({ row }) => `${row.getValue('net_weight')} kg`,
    },
    {
        accessorKey: 'box_weight',
        header: 'Box Weight',
        cell: ({ row }) => `${row.getValue('box_weight')} kg`,
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
            const product = row.original;
            return product.category?.name ?? 'N/A';
        },
    },
    {
        accessorKey: 'supplier',
        header: 'Supplier',
        cell: ({ row }) => {
            const product = row.original;
            return product.supplier?.name ?? 'N/A';
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell item={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
];
