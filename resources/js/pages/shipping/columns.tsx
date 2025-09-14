'use client';

import ActionsCell from '@/components/shared/actions-cell';
import { formatCurrency } from '@/lib/utils';
import { Shipping } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'in_transit':
            return 'bg-blue-100 text-blue-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        case 'returned':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

function StatusBadge({ status }: Readonly<{ status: string }>) {
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export const createColumns = (onEdit: (shipping: Shipping) => void, onDelete: (shipping: Shipping) => void): ColumnDef<Shipping>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false,
    },
    {
        accessorKey: 'tracking_number',
        header: 'Tracking #',
        enableHiding: false,
    },
    {
        accessorKey: 'carrier',
        header: 'Carrier',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => formatCurrency(row.original.total),
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
