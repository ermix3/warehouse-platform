import ActionsCell from '@/components/shared/actions-cell';
import { Category } from '@/types/category';
import { ColumnDef } from '@tanstack/react-table';

export const createColumns = (onEdit: (category: Category) => void, onDelete: (category: Category) => void): ColumnDef<Category>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'name',
        enableHiding: false,
    },
    {
        accessorKey: 'description',
        header: 'description',
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
