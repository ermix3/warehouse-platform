import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';
import { Eye, EyeOff } from 'lucide-react';

interface ColumnVisibilityProps<TData> {
    table: Table<TData>;
}

export function ColumnVisibility<TData>({ table }: Readonly<ColumnVisibilityProps<TData>>) {
    const visibleColumns = table.getAllColumns().filter((column) => column.getCanHide());
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto" type="button">
                    <Eye className="mr-2 h-4 w-4" />
                    Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]" sideOffset={5}>
                <div className="p-2">
                    <div className="text-sm font-medium mb-2">Toggle columns</div>
                    <div className="space-y-2">
                        {visibleColumns.map((column) => {
                            const header = typeof column.columnDef.header === 'string' 
                                ? column.columnDef.header 
                                : column.id;

                            return (
                                <div key={column.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={column.id}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    />
                                    <label
                                        htmlFor={column.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {header}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-2 mt-4 pt-2 border-t">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => table.resetColumnVisibility()}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                                table.getAllColumns().forEach((column) => {
                                    if (column.getCanHide()) {
                                        column.toggleVisibility(false);
                                    }
                                });
                            }}
                        >
                            <EyeOff className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
