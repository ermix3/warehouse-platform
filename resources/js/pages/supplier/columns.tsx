import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Supplier } from '@/types/supplier';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface ActionsProps {
    supplier: Supplier;
    onEdit: (supplier: Supplier) => void;
    onDelete: (supplier: Supplier) => void;
}

function ActionsCell({ supplier, onEdit, onDelete }: Readonly<ActionsProps>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(supplier)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(supplier)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const createColumns = (onEdit: (supplier: Supplier) => void, onDelete: (supplier: Supplier) => void): ColumnDef<Supplier>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
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
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionsCell supplier={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
];
