import type { BaseEntity, DataPagination, SharedData, Timestamps } from '@/types';

export interface UserRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    avatar: File | string | null;
}

export interface UserLite extends Pick<BaseEntity, 'id'> {
    name: string;
    email: string;
}

export interface User extends UserLite, Timestamps {
    email_verified_at?: string;
    avatar_url?: string;
}

export interface PageUserProps extends SharedData {
    users: DataPagination<User>;
}

export interface CreateUserProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditUserProps extends CreateUserProps {
    user: User | null;
}
