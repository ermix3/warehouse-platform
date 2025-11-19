import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ActionsEnum, ResourcesEnum } from '@/enums';
import { dashboard } from '@/routes';
import customers from '@/routes/customers';
import orders from '@/routes/orders';
import products from '@/routes/products';
import roles from '@/routes/roles';
import shipments from '@/routes/shipments';
import suppliers from '@/routes/suppliers';
import transactions from '@/routes/transactions';
import users from '@/routes/users';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Cog, Handshake, Landmark, LayoutGrid, Ship, ShoppingBag, ShoppingCart, UserRoundCog, UsersRound } from 'lucide-react';
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
        permissions: [
            `${ActionsEnum.VIEW}_${ResourcesEnum.PRODUCTS}`,
            `${ActionsEnum.CREATE}_${ResourcesEnum.PRODUCTS}`,
            `${ActionsEnum.EDIT}_${ResourcesEnum.PRODUCTS}`,
            `${ActionsEnum.DELETE}_${ResourcesEnum.PRODUCTS}`,
        ],
    },
    {
        title: 'Orders',
        href: orders.index(),
        icon: ShoppingCart,
        permissions: [
            `${ActionsEnum.VIEW}_${ResourcesEnum.ORDERS}`,
            `${ActionsEnum.VIEW_OWN}_${ResourcesEnum.ORDERS}`,
            `${ActionsEnum.CREATE}_${ResourcesEnum.ORDERS}`,
            `${ActionsEnum.EDIT}_${ResourcesEnum.ORDERS}`,
            `${ActionsEnum.DELETE}_${ResourcesEnum.ORDERS}`,
        ],
    },
    {
        title: 'Suppliers',
        href: suppliers.index(),
        icon: Handshake,
        permissions: [
            `${ActionsEnum.VIEW}_${ResourcesEnum.SUPPLIERS}`,
            `${ActionsEnum.CREATE}_${ResourcesEnum.SUPPLIERS}`,
            `${ActionsEnum.EDIT}_${ResourcesEnum.SUPPLIERS}`,
            `${ActionsEnum.DELETE}_${ResourcesEnum.SUPPLIERS}`,
        ],
    },
    {
        title: 'Customers',
        href: customers.index(),
        icon: UsersRound,
        permissions: [
            `${ActionsEnum.VIEW}_${ResourcesEnum.CUSTOMERS}`,
            `${ActionsEnum.CREATE}_${ResourcesEnum.CUSTOMERS}`,
            `${ActionsEnum.EDIT}_${ResourcesEnum.CUSTOMERS}`,
            `${ActionsEnum.DELETE}_${ResourcesEnum.CUSTOMERS}`,
        ],
    },
];

const officeNavItems: NavItem[] = [
    {
        title: 'Transactions',
        href: transactions.index('date'),
        icon: Landmark,
        permissions: [
            `${ActionsEnum.VIEW}_${ResourcesEnum.TRANSACTIONS}`,
            `${ActionsEnum.VIEW_OWN}_${ResourcesEnum.TRANSACTIONS}`,
            `${ActionsEnum.CREATE}_${ResourcesEnum.TRANSACTIONS}`,
            `${ActionsEnum.EDIT}_${ResourcesEnum.TRANSACTIONS}`,
            `${ActionsEnum.DELETE}_${ResourcesEnum.TRANSACTIONS}`,
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Shipments',
        href: shipments.index(),
        icon: Ship,
        permissions: [
            `${ActionsEnum.VIEW}_${ResourcesEnum.SHIPMENTS}`,
            `${ActionsEnum.VIEW_OWN}_${ResourcesEnum.SHIPMENTS}`,
            `${ActionsEnum.CREATE}_${ResourcesEnum.SHIPMENTS}`,
            `${ActionsEnum.EDIT}_${ResourcesEnum.SHIPMENTS}`,
            `${ActionsEnum.DELETE}_${ResourcesEnum.SHIPMENTS}`,
            `${ActionsEnum.TRACK_OWN}_${ResourcesEnum.SHIPMENTS}`,
        ],
    },
    {
        title: 'Users',
        href: users.index(),
        icon: UserRoundCog,
        permissions: [
            `${ActionsEnum.VIEW}_${ResourcesEnum.USERS}`,
            `${ActionsEnum.CREATE}_${ResourcesEnum.USERS}`,
            `${ActionsEnum.EDIT}_${ResourcesEnum.USERS}`,
            `${ActionsEnum.DELETE}_${ResourcesEnum.USERS}`,
        ],
    },
    {
        title: 'Roles',
        href: roles.index(),
        icon: Cog,
        permissions: [
            `${ActionsEnum.VIEW}_${ResourcesEnum.ROLES}`,
            `${ActionsEnum.CREATE}_${ResourcesEnum.ROLES}`,
            `${ActionsEnum.EDIT}_${ResourcesEnum.ROLES}`,
            `${ActionsEnum.DELETE}_${ResourcesEnum.ROLES}`,
        ],
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
                <NavMain items={officeNavItems} label="Office" />
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
