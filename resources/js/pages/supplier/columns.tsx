import { ActionsCell } from '@/components/shared';
import { Supplier } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export const createColumns = (onEdit: (supplier: Supplier) => void, onDelete: (supplier: Supplier) => void): ColumnDef<Supplier>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false,
    },
    {
        accessorKey: 'code',
        header: 'Code',
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        enableHiding: false,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => row.original.email || '-',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => row.original.phone || '-',
    },
    {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => (row.original.address ? row.original.address.substring(0, 50) + '...' : '-'),
    },
    {
        accessorKey: 'notes',
        header: 'Notes',
        cell: ({ row }) => row.original.notes || '-',
    },
    {
        accessorKey: 'products_count',
        header: 'Products',
        cell: ({ row }) => row.original?.products_count ?? 0,
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell item={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
];
