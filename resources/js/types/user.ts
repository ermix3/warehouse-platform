import { PaginationLink } from '@/types';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserPagination {
    data: User[];
    links: PaginationLink[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    from: number;
    to: number;
    total: number;
}
