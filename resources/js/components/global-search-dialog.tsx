import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { getIconByType } from '@/lib/utils';
import { GlobalSearchDialogProps, GlobalSearchResultItem, GlobalSearchResults } from '@/types/global-search';
import { router } from '@inertiajs/react';
import { CircleSlash2, CornerDownLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import { Icon } from './icon';

export function GlobalSearchDialog({ open, onOpenChange }: Readonly<GlobalSearchDialogProps>) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<GlobalSearchResults | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    /** Reset search when closing */
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setQuery('');
            setResults(null);
            setLoading(false);

            // Cancel pending request if dialog closes
            abortRef.current?.abort();
        }
        onOpenChange(isOpen);
    };

    /** Debounced Search with AbortController (prevents race conditions) */
    const handleSearch = (value: string) => {
        setQuery(value);

        const trimmed = value.trim();
        if (trimmed.length < 2) {
            setResults(null);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            abortRef.current?.abort();

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                setLoading(true);

                const response = await fetch(`/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal });

                if (!response.ok) return;
                const data = await response.json();

                setResults(data.results as GlobalSearchResults);
            } catch (error) {
                console.log('GlobalSearchDialog - handleSearch => Error ', error);
            } finally {
                setLoading(false);
            }
        }, 200); // shorter debounce = faster UX
    };

    /** Handle selection */
    const handleSelect = (item: GlobalSearchResultItem) => {
        onOpenChange(false);
        router.visit(item.url, { replace: true });
    };

    /** groups */
    const groups: { key: keyof GlobalSearchResults; title: string }[] = [
        { key: 'customers', title: 'Customers' },
        { key: 'suppliers', title: 'Suppliers' },
        { key: 'products', title: 'Products' },
        { key: 'orders', title: 'Orders' },
        { key: 'shipments', title: 'Shipments' },
        { key: 'transactions', title: 'Transactions' },
    ];

    /** Return first result as default ENTER behavior */
    const getFirstResult = (): GlobalSearchResultItem | null => {
        if (!results) return null;

        for (const { key } of groups) {
            const items = results[key];
            if (items?.length) return items[0];
        }
        return null;
    };

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
                    }

                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const first = getFirstResult();
                        if (first) handleSelect(first);
                    }
                }}
            />

            <CommandList className="max-h-[60vh]">
                <CommandEmpty>
                    {loading ? (
                        'Searching...'
                    ) : query.trim().length < 2 ? (
                        'At least 2 characters to search.'
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-center">
                            <CircleSlash2 size={24} strokeWidth={1} className="text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">No results found.</p>
                        </div>
                    )}
                </CommandEmpty>

                {results &&
                    groups.map(({ key, title }) => {
                        const items = results[key];
                        if (!items?.length) return null;

                        return (
                            <CommandGroup
                                key={key}
                                heading={title}
                                className="[&_[cmdk-group-heading]]:text-md mt-2 [&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:z-10 [&_[cmdk-group-heading]]:bg-background [&_[cmdk-group-heading]]:font-semibold"
                            >
                                {items.map((item) => (
                                    <CommandItem
                                        key={`${item.type}-${item.id}`}
                                        value={query || item.label}
                                        onSelect={() => handleSelect(item)}
                                        className="group my-1 cursor-pointer data-[selected=true]:bg-muted data-[selected=true]:text-primary"
                                    >
                                        <div className="ml-5 flex flex-col">
                                            <div className="flex items-center">
                                                <span className="mr-2 h-4 w-4 flex-shrink-0 text-primary">
                                                    <Icon iconNode={getIconByType(item.type)} />
                                                </span>
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                            {item.subtitle && <span className="text-xs text-muted-foreground">{item.subtitle}</span>}
                                        </div>

                                        {/* ENTER indicator */}
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
