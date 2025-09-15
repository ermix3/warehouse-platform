import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import customers from '@/routes/customers';
import orders from '@/routes/orders';
import products from '@/routes/products';
import shippings from '@/routes/shippings';
import suppliers from '@/routes/suppliers';
import users from '@/routes/users';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Handshake, LayoutGrid, Ship, ShoppingBag, ShoppingCart, UserRoundCog, UsersRound } from 'lucide-react';
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
        icon: ShoppingBag,
    },
    {
        title: 'Orders',
        href: orders.index(),
        icon: ShoppingCart,
    },
    {
        title: 'Suppliers',
        href: suppliers.index(),
        icon: Handshake,
    },
    {
        title: 'Customers',
        href: customers.index(),
        icon: UsersRound,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Shippings',
        href: shippings.index(),
        icon: Ship,
    },
    {
        title: 'Users',
        href: users.index(),
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
                <NavMain items={mainNavItems} label="Platform" />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavMain items={footerNavItems} label="Other" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
