import { ActionsCell } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { getFormattedAmount } from '@/lib/utils';
import { Transaction } from '@/types/transaction';
import { ColumnDef, Row } from '@tanstack/react-table';

export const createColumnsByDate = (
    onEdit: (transaction: Transaction) => void,
    onDelete: (transaction: Transaction) => void,
    canEdit?: boolean,
    canDelete?: boolean,
): ColumnDef<Transaction>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false,
    },
    {
        accessorKey: 'customer.name',
        header: 'Customer',
        enableHiding: false,
    },
    {
        accessorKey: 'type',
        header: 'Type',
        enableHiding: false,
        cell: ({ row }) => {
            const transactionType: string = row.getValue('type');
            return (
                <Badge variant={transactionType === 'income' ? 'default' : 'destructive'}>
                    {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'value',
        header: 'Amount',
        cell: ({ row }) => {
            const value: number = row.original.value;
            return <div className="text-sm text-muted-foreground">{value ? getFormattedAmount(value) : '-'}</div>;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => {
            const createdAt: string = row.original.created_at;
            return <div className="text-sm text-muted-foreground">{createdAt ? new Date(createdAt).toLocaleDateString() : '-'}</div>;
        },
    },
    {
        accessorKey: 'notes',
        header: 'Notes',
        cell: ({ row }) => {
            const notes: string | undefined = row.original.notes;
            const trimmedNotes = (notes && notes.length > 20) ? `${notes.slice(0, 20)}...` : notes || '-';
            return (
                <div className="text-sm text-muted-foreground line-clamp-2">
                    {trimmedNotes}
                </div>
            );
        },
    },
    ...(canEdit || canDelete
        ? [
              {
                  id: 'actions',
                  header: 'Actions',
                  enableHiding: false,
                  cell: ({ row }: { row: Row<Transaction> }) => (
                      <ActionsCell item={row.original} onEdit={onEdit} onDelete={onDelete} canEdit={canEdit} canDelete={canDelete} />
                  ),
              },
          ]
        : []),
];
