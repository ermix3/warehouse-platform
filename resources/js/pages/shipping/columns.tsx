'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Shipping } from '@/types/shipping';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface ActionsProps {
    shipping: Shipping;
    onEdit: (shipping: Shipping) => void;
    onDelete: (shipping: Shipping) => void;
}

function ActionsCell({ shipping, onEdit, onDelete }: Readonly<ActionsProps>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(shipping)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(shipping)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

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

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}>
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
        cell: ({ row }) => `AED ${row.getValue('total')}`,
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
        cell: ({ row }) => <ActionsCell shipping={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
];


