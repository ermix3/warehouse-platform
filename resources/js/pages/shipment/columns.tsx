'use client';

import ActionsCell from '@/components/shared/actions-cell';
import { Button } from '@/components/ui/button';
import { ShipmentStatusBadge } from '@/lib/shipment-status-helper';
import { getFormattedAmount } from '@/lib/utils';
import { show } from '@/routes/shipments';
import { Shipment } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { TextSearch } from 'lucide-react';

export const createColumns = (onEdit: (shipment: Shipment) => void, onDelete: (shipment: Shipment) => void): ColumnDef<Shipment>[] => {
    return [
        {
            accessorKey: 'id',
            header: 'ID',
            enableHiding: false,
        },
        {
            accessorKey: 'tracking_number',
            header: 'Tracking #',
            enableHiding: false,
            cell: ({ row }) => <div className="font-medium">{row.original.tracking_number || '-'}</div>,
        },
        {
            accessorKey: 'carrier',
            header: 'Carrier',
            cell: ({ row }) => <div className="font-medium">{row.original.carrier || '-'}</div>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <ShipmentStatusBadge status={row.original.status} />,
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: ({ row }) => <div className="font-medium">{getFormattedAmount(row.original.total)}</div>,
        },
        {
            accessorKey: 'orders_count',
            header: 'Orders',
            cell: ({ row }) => <div className="text-center font-medium">{row.original?.orders_count ?? 0}</div>,
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => {
                const createdAt = row.original?.created_at;
                return <div className="text-sm text-muted-foreground">{createdAt ? new Date(createdAt).toLocaleDateString() : '-'}</div>;
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
