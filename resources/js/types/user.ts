import type { BaseEntity, DataPagination, SharedData, Timestamps } from '@/types';
import type { Permission, RoleLite } from '@/types/role';

export interface UserRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    avatar: File | string | null;
    roles?: string[];
    permissions?: string[];
}

export interface UserLite extends Pick<BaseEntity, 'id'> {
    name: string;
    email: string;
}

export interface User extends UserLite, Timestamps {
    email_verified_at?: string;
    avatar_url?: string;
    roles?: RoleLite[];
    permissions?: Permission[];
}

export interface PageUserProps extends SharedData {
    users: DataPagination<User>;
    roles: RoleLite[];
    permissions: Permission[];
}

export interface CreateUserProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface EditUserProps extends CreateUserProps {
    user: User | null;
}
