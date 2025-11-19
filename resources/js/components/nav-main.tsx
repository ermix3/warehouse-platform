import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

type NavMainProps = { items: NavItem[]; label?: string };

export function NavMain({ items = [], label = '' }: Readonly<NavMainProps>) {
    const {
        url,
        props: {
            auth: { user },
        },
    } = usePage<SharedData>();
    const data = items.filter((item) => {
        return user.roles?.map((r: string) => r.toLowerCase())?.includes('admin') || item?.permissions?.some((p) => user?.permissions?.includes(p));
    });

    return (
        <SidebarGroup className="px-2 py-0">
            {label && data.length > 0 && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {data.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
