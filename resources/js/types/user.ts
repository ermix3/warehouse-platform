import { DataPagination, Filters, Flash } from '@/types';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PageUserProps {
    users: DataPagination<User>;
    flash?: Flash;
    filters: Filters;
    [key: string]: unknown;
}

export interface CreateUserProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditUserProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}
