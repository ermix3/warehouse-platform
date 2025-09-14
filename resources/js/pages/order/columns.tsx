import ActionsCell from '@/components/shared/actions-cell';
import { OrderStatusBadge } from '@/lib/order-status-helper';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types/order';
import { ColumnDef } from '@tanstack/react-table';

export const createColumns = (onEdit: (order: Order) => void, onDelete: (order: Order) => void): ColumnDef<Order>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false,
    },
    {
        accessorKey: 'order_number',
        header: 'Order Number',
        enableHiding: false,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => formatCurrency(row.original.total),
    },
    {
        accessorKey: 'customer.name',
        header: 'Customer',
        cell: ({ row }) => row.original.customer?.name || 'Unknown',
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            if (!row.original.created_at) return 'N/A';
            return new Date(row.original.created_at).toLocaleDateString();
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell item={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
];
