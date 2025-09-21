import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type ExportProps = {
    label?: string;
    onExport: (type: 'csv' | 'excel') => void;
};

export function ExportData({ label = 'Export', onExport }: Readonly<ExportProps>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default">{label}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onExport('csv')}>CSV</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onExport('excel')}>Excel</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
