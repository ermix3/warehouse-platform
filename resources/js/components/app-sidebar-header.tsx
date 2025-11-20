import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { GlobalSearchDialog } from './global-search-dialog';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Command, Search } from 'lucide-react';

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
                        className="group cursor-pointer flex items-center gap-1 text-muted-foreground rounded-md hover:bg-muted-background/10 focus:bg-muted-background/20  focus:ring-inset focus:ring-foreground shadow-xs"
                        onClick={() => setIsSearchOpen(true)}
                        aria-label="Open global search (Ctrl+K)"
                    >
                        <Search className="h-4 w-4" />
                        <div className="hidden md:flex items-center justify-center gap-2 text-sm">
                            <p className="font-medium mr-20">Search</p>
                            <div className="flex items-center gap-1 rounded-md bg-muted-background/20 px-2 py-1 hover:bg-muted-background/30 transition-colors">
                                <Command size={16} strokeWidth={1} className="text-foreground-alt" />
                                <p className="font-bold text-foreground-alt">K</p>
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
            <GlobalSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
        </header>
    );
}
