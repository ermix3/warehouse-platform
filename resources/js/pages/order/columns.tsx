import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types/order';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface ActionsProps {
    order: Order;
    onEdit: (order: Order) => void;
    onDelete: (order: Order) => void;
}

function ActionsCell({ order, onEdit, onDelete }: Readonly<ActionsProps>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(order)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(order)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case 'draft':
            return 'bg-gray-100 text-gray-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
            return 'bg-blue-100 text-blue-800';
        case 'shipped':
            return 'bg-purple-100 text-purple-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
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
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
        cell: ({ row }) => <ActionsCell order={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
];
