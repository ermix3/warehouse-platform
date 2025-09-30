import { ActionsCell } from '@/components/shared';
import { Supplier } from '@/types';
import { ColumnDef, Row } from '@tanstack/react-table';

export const createColumns = (onEdit: (supplier: Supplier) => void, onDelete: (supplier: Supplier) => void, canEdit?: boolean, canDelete?: boolean): ColumnDef<Supplier>[] => [
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
    ...(canEdit || canDelete
        ? [
              {
                  id: 'actions',
                  header: 'Actions',
                  enableHiding: false,
                  cell: ({ row }: { row: Row<Supplier> }) => (
                      <ActionsCell item={row.original} onEdit={onEdit} onDelete={onDelete} canEdit={canEdit} canDelete={canDelete} />
                  ),
              },
          ]
        : []),
];
