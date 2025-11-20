import { useState } from 'react';
import { router } from '@inertiajs/react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Icon } from './icon';
import { CircleSlash2, CornerDownLeft } from 'lucide-react';
import { getIconByType } from '@/lib/utils';
import { GlobalSearchDialogProps, GlobalSearchResultItem, GlobalSearchResults } from '@/types/global-search';

export function GlobalSearchDialog({ open, onOpenChange }: Readonly<GlobalSearchDialogProps>) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<GlobalSearchResults | null>(null);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setQuery('');
            setResults(null);
            setLoading(false);
        }

        onOpenChange(isOpen);
    };

    const handleSearch = async (value: string) => {
        setQuery(value);
        const trimmed = value.trim();
        if (trimmed.length < 2) {
            setResults(null);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/search?q=${encodeURIComponent(trimmed)}`);
            if (!response.ok) return;
            const data = await response.json();
            setResults(data.results as GlobalSearchResults);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item: GlobalSearchResultItem) => {
        onOpenChange(false);
        router.visit(item.url);
    };

    const groups: { key: keyof GlobalSearchResults; title: string }[] = [
        { key: 'customers', title: 'Customers' },
        { key: 'suppliers', title: 'Suppliers' },
        { key: 'products', title: 'Products' },
        { key: 'orders', title: 'Orders' },
        { key: 'shipments', title: 'Shipments' },
        { key: 'transactions', title: 'Transactions' },
    ];

    return (
        <CommandDialog
            open={open}
            onOpenChange={handleOpenChange}
            className="top-40 left-1/2 w-full max-w-2xl -translate-x-1/2 translate-y-0 sm:max-w-3xl"
        >
            <CommandInput
                autoFocus
                placeholder="Search customers, suppliers, products, orders, shipments, transactions..."
                value={query}
                onValueChange={handleSearch}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        handleOpenChange(false);
                        return;
                    }

                    if (e.key === 'Enter') {
                        e.preventDefault();

                        if (results) {
                            for (const { key } of groups) {
                                const items = results[key];
                                if (items && items.length > 0) {
                                    handleSelect(items[0]);
                                    break;
                                }
                            }
                        }
                    }
                }}
            />
            <CommandList className="max-h-[60vh]">
                <CommandEmpty>
                    {
                    loading ? 'Searching...' :
                    query.trim().length < 2 ?
                    'At least 2 characters to search.' :
                    (<div className="flex flex-col items-center gap-2 text-center">
                        <CircleSlash2 size={24} strokeWidth={1} className="text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">No results found.</p>
                    </div>)
                    }
                </CommandEmpty>
                {results &&
                    groups.map(({ key, title }) => {
                        const items = results[key];
                        if (!items || items.length === 0) return null;
                        return (
                            <CommandGroup
                                key={key}
                                heading={title}
                                className="mt-2 [&_[cmdk-group-heading]]:font-bolder [&_[cmdk-group-heading]]:text-md [&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:z-10 [&_[cmdk-group-heading]]:bg-background"
                            >
                                {items.map((item) => (
                                    <CommandItem
                                        key={`${item.type}-${item.id}`}
                                        value={query || item.label}
                                        onSelect={() => handleSelect(item)}
                                        className="group my-1 cursor-pointer data-[selected=true]:bg-muted data-[selected=true]:text-primary"
                                    >
                                        <div className="flex flex-col ml-5">
                                            <div className="flex items-center">
                                                <span className={`h-4 w-4 flex-shrink-0 mr-2 ${item.type === 'customer' ? 'text-primary' : 'text-accent'}`}>
                                                    <Icon iconNode={getIconByType(item.type)} />
                                                </span>
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                            {item.subtitle && <span className="text-xs text-muted-foreground">{item.subtitle}</span>}
                                        </div>
                                        <span className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                                            <CornerDownLeft size={16} className="text-foreground" />
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        );
                    })}
            </CommandList>
        </CommandDialog>
    );
}
