import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import categories from '@/routes/categories';
import products from '@/routes/products';
import suppliers from '@/routes/suppliers';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, PackageCheck, Ship, ShoppingBasket, UserRoundCog, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: products.index(),
        icon: ShoppingBasket,
    },
    {
        title: 'Orders',
        href: '#',
        icon: PackageCheck,
    },
    {
        title: 'Categories',
        href: categories.index(),
        icon: Folder,
    },
    {
        title: 'Suppliers',
        href: suppliers.index(),
        icon: BookOpen,
    },
    {
        title: 'Customers',
        href: '/customers',
        icon: UsersRound,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Shippings',
        href: '#',
        icon: Ship,
    },
    {
        title: 'Users',
        href: '#',
        icon: UserRoundCog,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
