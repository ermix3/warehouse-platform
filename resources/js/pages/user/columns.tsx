import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User } from '@/types/user';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, MoreHorizontal, Pencil, Trash2, XCircle } from 'lucide-react';

interface ActionsProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

function ActionsCell({ user, onEdit, onDelete }: Readonly<ActionsProps>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(user)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(user)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const createColumns = (onEdit: (user: User) => void, onDelete: (user: User) => void): ColumnDef<User>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false, // Always show ID column
    },
    {
        accessorKey: 'name',
        header: 'Name',
        enableHiding: false, // Always show Name column
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'email_verified_at',
        header: 'Verified',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                {row.original.email_verified_at ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
            </div>
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false, // Always show Actions column
        cell: ({ row }) => <ActionsCell user={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
];
