import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Command, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GlobalSearchDialog } from './global-search-dialog';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <header className="flex h-16 shrink-0 items-center border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <div className="flex flex-1 justify-center">
                    <Button
                        variant="ghost"
                        size="default"
                        className="group flex cursor-pointer items-center gap-1 rounded-md bg-accent/50 text-muted-foreground shadow-xs hover:bg-accent/60 dark:bg-accent/50 dark:hover:bg-accent/60"
                        onClick={() => setIsSearchOpen(true)}
                        aria-label="Open global search (Ctrl+K)"
                    >
                        <Search className="h-4 w-4" />
                        <div className="hidden items-center justify-center gap-2 text-sm md:flex">
                            <p className="mr-20 font-medium">Search</p>
                            <div className="bg-muted-background/20 hover:bg-muted-background/30 flex items-center gap-1 rounded-md px-2 py-1 transition-colors">
                                <Command size={16} strokeWidth={1} className="text-foreground-alt" />
                                <p className="text-foreground-alt font-bold">K</p>
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
            <GlobalSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
        </header>
    );
}
