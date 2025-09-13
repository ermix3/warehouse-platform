'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ColumnVisibility } from './column-visibility';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchValue?: string;
    searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({ columns, data, searchValue = '', searchPlaceholder = '' }: Readonly<DataTableProps<TData, TValue>>) {
    const [isSearching, setIsSearching] = useState(false);
    const [isSorting, setIsSorting] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [columnVisibility, setColumnVisibility] = useState({});

    // Initialize and sync sorting state with URL parameters
    useEffect(() => {
        const url = new URL(window.location.href);
        const urlSortBy = url.searchParams.get('sort_by') || '';
        const urlSortOrder = url.searchParams.get('sort_order') || 'asc';

        setSortBy(urlSortBy);
        setSortOrder(urlSortOrder as 'asc' | 'desc');
    }, []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualFiltering: true,
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
    });

    const debouncedSearch = useDebouncedCallback((value: string) => {
        setIsSearching(true);
        const url = new URL(window.location.href);

        if (value.trim()) {
            url.searchParams.set('search', value.trim());
        } else {
            url.searchParams.delete('search');
        }

        // Reset to first page on search
        url.searchParams.delete('page');

        router.get(
            url.pathname + url.search,
            {},
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsSearching(false),
            },
        );
    }, 500);

    const handleSort = (columnId: string) => {
        setIsSorting(true);
        const url = new URL(window.location.href);

        // Determine new sort order
        let newOrder: 'asc' | 'desc' = 'asc';
        if (sortBy === columnId && sortOrder === 'asc') {
            newOrder = 'desc';
        }

        // Update URL parameters
        url.searchParams.set('sort_by', columnId);
        url.searchParams.set('sort_order', newOrder);

        // Reset to first page on sort
        url.searchParams.delete('page');

        // Update local state immediately for instant UI feedback
        setSortBy(columnId);
        setSortOrder(newOrder);

        router.get(
            url.pathname + url.search,
            {},
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsSorting(false),
            },
        );
    };

    const getSortIcon = (columnId: string) => {
        if (sortBy !== columnId) {
            return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
        }

        return sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4 text-primary" /> : <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
    };

    return (
        <div className="space-y-4">
            {/* Search and Column Visibility */}
            <div className="flex items-center gap-2 py-4">
                <div className="relative max-w-md flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder || 'Search ...'}
                        defaultValue={searchValue}
                        onChange={(event) => debouncedSearch(event.target.value)}
                        className="pl-9"
                        disabled={isSearching}
                    />
                    {isSearching && (
                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    )}
                </div>
                {searchValue && (
                    <div className="text-sm text-muted-foreground">
                        Searching for: <span className="font-medium">"{searchValue}"</span>
                    </div>
                )}
                <ColumnVisibility table={table} />
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const isSortable = header.column.id !== 'actions';

                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                isSortable && 'cursor-pointer transition-colors select-none hover:bg-muted/50',
                                                sortBy === header.column.id && 'bg-muted/30',
                                            )}
                                            onClick={isSortable ? () => handleSort(header.column.id) : undefined}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div className="flex items-center">
                                                    {flexRender(header.column.columnDef.header, {
                                                        ...header.getContext(),
                                                        column: {
                                                            ...header.column,
                                                            toggleSorting: () => handleSort(header.column.id),
                                                        },
                                                    })}
                                                    {isSortable && getSortIcon(header.column.id)}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isSorting ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span className="text-muted-foreground">Sorting...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="transition-colors hover:bg-muted/50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Search className="h-8 w-8" />
                                        <div>
                                            <p className="font-medium">No results found</p>
                                            {searchValue && <p className="text-sm">Try adjusting your search terms or clear the search filter.</p>}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
