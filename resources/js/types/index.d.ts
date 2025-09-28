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

export interface Timestamps {
    created_at: string;
    updated_at: string;
}

export interface BaseEntity extends Timestamps {
    id: number;
}

export interface SelectOption<T = string> {
    value: T;
    label: string;
}

export type SortOrder = 'asc' | 'desc';

export interface Filters {
    search?: string;
    sort_by?: string;
    sort_order?: SortOrder;
}

export interface Flash {
    success?: string;
    error?: string;
}

type Quote = {
    message: string;
    author: string;
};

export interface SharedData {
    name: string;
    sidebarOpen: boolean;
    quote: Quote;
    auth: Auth;
    filters: Filters;
    enums: SharedEnums;
    flash?: Flash;
    [key: string]: unknown;
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
    [key: string]: unknown;
}

export interface PaginationProps {
    links: Links[];
    from: number;
    to: number;
    total: number;
}

export interface FileInputProps {
    id: string;
    accept?: string;
    onChange: (file: File | null) => void;
    preview?: string | null;
    className?: string;
    label?: string;
    disabled?: boolean;
}
