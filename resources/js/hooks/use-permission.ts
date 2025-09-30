import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePermission() {
    const {user} = usePage<SharedData>().props.auth;
    const hasRole = (name: string) => user.roles.includes(name);
    const hasPermission = (name: string) => user.permissions.includes(name);
    return { hasRole, hasPermission };
}
