import ActionsCell from '@/components/shared/actions-cell';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/lib/order-status-helper';
import { getFormatedAmount } from '@/lib/utils';
import { show } from '@/routes/orders';
import { Order } from '@/types/order';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { TextSearch } from 'lucide-react';

export const createColumns = (onEdit: (order: Order) => void, onDelete: (order: Order) => void): ColumnDef<Order>[] => {
    return [
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
            cell: ({ row }) => getFormatedAmount(row.original.total),
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
            id: 'details',
            header: 'Details',
            enableHiding: false,
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <Button variant="outline" size="sm" onClick={() => router.visit(show(order.id))} className="hover:cursor-pointer">
                        <TextSearch />
                    </Button>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            enableHiding: false,
            cell: ({ row }) => <ActionsCell item={row.original} onEdit={onEdit} onDelete={onDelete} />,
        },
    ];
};
