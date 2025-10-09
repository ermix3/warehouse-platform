import { ActionsEnum, ResourcesEnum } from '@/enums';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { user } = usePage<SharedData>().props.auth;

    /**
     * Checks if the user has the specified role.
     * @param {string} name - The name of the role to check.
     * @returns {boolean} True if the user has the role, false otherwise.
     */
    const hasRole = (name: string): boolean => user.roles.includes(name);

    /**
     * Checks if the user has the required permission.
     * @param {ActionsEnum} action The action to check for.
     * @param {ResourcesEnum} resource The resource to check for.
     * @returns {boolean} True if the user has the permission, false otherwise.
     */
    const hasPermission = (action: ActionsEnum, resource: ResourcesEnum): boolean => user.permissions.includes(`${action}_${resource}`);

    return { hasRole, hasPermission };
}
