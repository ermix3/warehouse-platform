<?php

namespace App\Policies;

use App\Enums\RolesEnum;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_roles');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Role $role): bool
    {
        return $user->can('view_roles');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_roles');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Role $role): bool
    {
        // Admins can only be managed by other admins
        if ($role->name === RolesEnum::ADMIN->value) {
            return $user->hasRole(RolesEnum::ADMIN->value) && $user->can('edit_roles');
        }

        return $user->can('edit_roles');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Role $role): bool
    {
        // Prevent deleting the admin role
        if ($role->name === RolesEnum::ADMIN->value) {
            return false;
        }

        // Prevent users from deleting their own role
        if ($user->roles->contains($role)) {
            return false;
        }

        return $user->can('delete_roles');
    }

    /**
     * Determine whether the user can assign the role.
     */
    public function assign(User $user, Role $role): bool
    {
        // Only admins can assign the admin role
        if ($role->name === RolesEnum::ADMIN->value) {
            return $user->hasRole(RolesEnum::ADMIN->value) && $user->can('assign_roles');
        }

        return $user->can('assign_roles');
    }
}
