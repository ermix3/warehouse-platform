import { ActionsCell } from '@/components/shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';
import { ColumnDef, Row } from '@tanstack/react-table';

export const createColumns = (
    onEdit: (user: User) => void,
    onDelete: (user: User) => void,
    canEdit?: boolean,
    canDelete?: boolean,
): ColumnDef<User>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false, // Always show ID column
    },
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        enableSorting: false,
        cell: ({ row }) => (
            <Avatar>
                <AvatarImage src={row.original.avatar_url} alt={row.original.name} />
                <AvatarFallback>
                    {row.original.name
                        .split(' ')
                        .map((word) => word.charAt(0))
                        .join('')
                        .slice(0, 3)}
                </AvatarFallback>
            </Avatar>
        ),
    },
    {
        accessorKey: 'name',
        header: 'Name',
        enableHiding: false, // Always show Name column
    },
    {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: false,
        cell: ({ row }) => row.original.email || '-',
    },
    // {
    //     accessorKey: 'email_verified_at',
    //     header: 'Verified',
    //     enableSorting: false,
    //     cell: ({ row }) => (
    //         <div className="flex items-center justify-center">
    //             {row.original.email_verified_at ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
    //         </div>
    //     ),
    // },
    {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => (row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : '-'),
    },
    ...(canEdit || canDelete
        ? [
              {
                  id: 'actions',
                  header: 'Actions',
                  enableHiding: false,
                  cell: ({ row }: { row: Row<User> }) => (
                      <ActionsCell item={row.original} onEdit={onEdit} onDelete={onDelete} canEdit={canEdit} canDelete={canDelete} />
                  ),
              },
          ]
        : []),
];
