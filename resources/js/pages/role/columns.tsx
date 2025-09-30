'use client';

import ActionsCell from '@/components/shared/actions-cell';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getPermissionsOptions } from '@/lib/utils';
import { Role } from '@/types';
import { ColumnDef, Row } from '@tanstack/react-table';

export const createColumns = (
    onEdit: (role: Role) => void,
    onDelete: (role: Role) => void,
    canEdit?: boolean,
    canDelete?: boolean,
): ColumnDef<Role>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'permissions',
        header: 'Permissions',
        enableSorting: false,
        cell: ({ row }: { row: Row<Role> }) => {
            if (!row.original.permissions) return 'N/A';
            const permissions = getPermissionsOptions(row.original.permissions);
            const maxVisible = 4;
            const visible = permissions.slice(0, maxVisible);
            const hidden = permissions.slice(maxVisible);
            return (
                <div className="flex flex-wrap items-center gap-1">
                    {visible.map(({ label, value }) => (
                        <Badge key={value} className="rounded-full border border-blue-200 bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            {label}
                        </Badge>
                    ))}
                    {hidden.length > 0 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge className="cursor-pointer rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                        +{hidden.length}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs p-2">
                                    <div className="flex flex-wrap gap-1">
                                        {hidden.map(({ label, value }) => (
                                            <Badge
                                                key={value}
                                                className="rounded-full border border-blue-200 bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                                            >
                                                {label}
                                            </Badge>
                                        ))}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
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
                  cell: ({ row }: { row: Row<Role> }) => (
                      <ActionsCell item={row.original} onEdit={onEdit} onDelete={onDelete} canEdit={canEdit} canDelete={canDelete} />
                  ),
              },
          ]
        : []),
];
