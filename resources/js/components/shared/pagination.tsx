import { Button } from '@/components/ui/button';
import { PaginationLink } from '@/types';
import { router } from '@inertiajs/react';

type PaginationProps = {
    links: PaginationLink[];
    from: number;
    to: number;
    total: number;
};

export function Pagination({ links, from, to, total }: Readonly<PaginationProps>) {
    if (links.length === 0) return null;

    return (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>
                Showing {from} to {to} of {total} results
            </div>
            <div className="flex gap-1">
                {links.map((link, idx) => (
                    <Button
                        key={idx + '-' + link.page}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        disabled={!link.url}
                        onClick={() => link.url && router.visit(link.url)}
                        dangerouslySetInnerHTML={{
                            __html: link.label,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
