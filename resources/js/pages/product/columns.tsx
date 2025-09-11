'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Product } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface ActionsProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

function ActionsCell({ product, onEdit, onDelete }: Readonly<ActionsProps>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(product)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const createColumns = (onEdit: (product: Product) => void, onDelete: (product: Product) => void): ColumnDef<Product>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'barcode',
        header: 'Barcode',
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
        cell: ({ row }) => <ActionsCell product={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
];
