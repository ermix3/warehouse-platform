import { Button } from '@/components/ui/button';
import { getFormattedAmount } from '@/lib/utils';
import { histories } from '@/routes/transactions';
import { TransactionByCustomer } from '@/types/transaction';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { TextSearch } from 'lucide-react';

export const createColumnsByCustomer = (): ColumnDef<TransactionByCustomer>[] => [
    {
        accessorKey: 'customer.id',
        header: 'Customer ID',
        enableHiding: false,
    },
    {
        accessorKey: 'customer.name',
        header: 'Customer Name',
    },
    {
        accessorKey: 'incomes',
        header: 'Income',
        cell: ({ row }) => getFormattedAmount(row.original.incomes, '₪'),
    },
    {
        accessorKey: 'outcomes',
        header: 'Outcome',
        cell: ({ row }) => getFormattedAmount(row.original.outcomes, '₪'),
    },
    {
        accessorKey: 'difference',
        header: 'Difference',
        cell: ({ row }) => {
            const difference = row.original.difference;
            const colorClass = difference >= 0 ? 'text-green-600' : 'text-red-600';
            return <span className={colorClass}>{getFormattedAmount(difference, '₪')}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => (
            <Link href={histories.url(row.original.customer.id)}>
                <Button variant="outline" size="icon" className="hover:cursor-pointer">
                    <TextSearch className="h-4 w-4" />
                </Button>
            </Link>
        ),
    },
];
