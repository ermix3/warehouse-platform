import { SharedEnums } from '@/types/enums';
import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export * from './customer';
export * from './enums';
export * from './order';
export * from './order-item';
export * from './product';
export * from './shipment';
export * from './supplier';
export * from './user';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

export interface Links {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

export interface DataPagination<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Links[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    enums: SharedEnums;
    [key: string]: unknown;
}

export interface Filters {
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface Flash {
    success?: string;
    error?: string;
}
