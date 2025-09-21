import MyTooltip from '@/components/shared/my-tooltip';
import { Button, buttonVariants } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { VariantProps } from 'class-variance-authority';
import { FileDown } from 'lucide-react';

type ExportProps = {
    label?: string;
    btnVariant?: Pick<VariantProps<typeof buttonVariants>, 'variant'>['variant'];
    btnSize?: Pick<VariantProps<typeof buttonVariants>, 'size'>['size'];
    onExport: (type: 'csv' | 'excel') => void;
};

export function ExportData({ label = 'Export', btnVariant = 'default', btnSize = 'default', onExport }: Readonly<ExportProps>) {
    return (
        <DropdownMenu>
            {btnSize === 'icon' ? (
                <MyTooltip title="Export data">
                    <DropdownMenuTrigger asChild>
                        <Button variant={btnVariant} className="hover:cursor-pointer">
                            <FileDown />
                        </Button>
                    </DropdownMenuTrigger>
                </MyTooltip>
            ) : (
                <DropdownMenuTrigger asChild>
                    <Button variant={btnVariant} className="hover:cursor-pointer">
                        {label}{' '}
                        <MyTooltip title="Export data">
                            <span style={{ display: 'inline-flex' }}>
                                <FileDown />
                            </span>
                        </MyTooltip>
                    </Button>
                </DropdownMenuTrigger>
            )}
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onExport('csv')} className="hover:cursor-pointer">
                    CSV
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onExport('excel')} className="hover:cursor-pointer">
                    Excel
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
