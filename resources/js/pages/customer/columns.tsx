import ActionsCell from '@/components/shared/actions-cell';
import { Customer } from '@/types/customer';
import { ColumnDef } from '@tanstack/react-table';

export const createColumns = (onEdit: (customer: Customer) => void, onDelete: (customer: Customer) => void): ColumnDef<Customer>[] => [
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
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
        accessorKey: 'notes',
        header: 'Notes',
    },
    {
        accessorKey: 'unique_products_bought_count',
        header: 'Products',
        cell: ({ row }) => row.original?.unique_products_bought_count ?? 0,
    },
    {
        accessorKey: 'orders_count',
        header: 'Orders',
        cell: ({ row }) => row.original?.orders_count ?? 0,
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell item={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
];
