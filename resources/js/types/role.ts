import type { BaseEntity, DataPagination, SharedData } from '@/types';

export interface Permission extends Pick<BaseEntity, 'id'> {
    name: string;
}

export interface RoleLite extends Pick<BaseEntity, 'id'> {
    name: string;
}

export interface Role extends RoleLite {
    permissions?: Permission[];
    permissions_count?: number;
}

export interface RoleRequest {
    name: string;
    permissions: string[];
}

export interface PageRoleProps extends SharedData {
    roles: DataPagination<Role>;
    permissions: Permission[];
}

export interface CreateRoleProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    permissions: Permission[];
}

export interface EditRoleProps extends CreateRoleProps {
    role: Role | null;
}
