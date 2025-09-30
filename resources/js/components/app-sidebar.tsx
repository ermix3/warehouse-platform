import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import customers from '@/routes/customers';
import orders from '@/routes/orders';
import products from '@/routes/products';
import shipments from '@/routes/shipments';
import suppliers from '@/routes/suppliers';
import users from '@/routes/users';
import type { NavItem } from '@/types';
import { RolesEnum } from '@/types/enums';
import { Link } from '@inertiajs/react';
import { Cog, Handshake, LayoutGrid, Ship, ShoppingBag, ShoppingCart, UserRoundCog, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';
import roles from '@/routes/roles';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: [RolesEnum.ADMIN, RolesEnum.STAFF, RolesEnum.ACCOUNTANT, RolesEnum.CUSTOMER],
    },
    {
        title: 'Products',
        href: products.index(),
        icon: ShoppingBag,
        roles: [RolesEnum.ADMIN, RolesEnum.STAFF, RolesEnum.ACCOUNTANT],
    },
    {
        title: 'Orders',
        href: orders.index(),
        icon: ShoppingCart,
        roles: [RolesEnum.ADMIN, RolesEnum.STAFF, RolesEnum.ACCOUNTANT, RolesEnum.CUSTOMER],
    },
    {
        title: 'Suppliers',
        href: suppliers.index(),
        icon: Handshake,
        roles: [RolesEnum.ADMIN, RolesEnum.STAFF, RolesEnum.ACCOUNTANT],
    },
    {
        title: 'Customers',
        href: customers.index(),
        icon: UsersRound,
        roles: [RolesEnum.ADMIN, RolesEnum.STAFF, RolesEnum.ACCOUNTANT],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Shipments',
        href: shipments.index(),
        icon: Ship,
        roles: [RolesEnum.ADMIN, RolesEnum.STAFF, RolesEnum.ACCOUNTANT, RolesEnum.CUSTOMER],
    },
    {
        title: 'Users',
        href: users.index(),
        icon: UserRoundCog,
        roles: [RolesEnum.ADMIN],
    },
    {
        title: 'Roles',
        href: roles.index(),
        icon: Cog,
        roles: [RolesEnum.ADMIN],
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
                <hr className="my-2 border-1 border-gray-500 dark:border-gray-300" />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <hr className="my-2 border-1 border-gray-500 dark:border-gray-300" />
                <NavMain items={footerNavItems} label="Other" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
