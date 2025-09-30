<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_users');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        // Users can always view their own profile
        if ($user->id === $model->id) {
            return true;
        }

        return $user->can('view_users');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_users');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Users can always update their own profile
        if ($user->id === $model->id) {
            return true;
        }

        // Only admins can update other admin users
        if ($model->hasRole('admin')) {
            return $user->hasRole('admin');
        }

        return $user->can('edit_users');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Prevent users from deleting themselves
        if ($user->id === $model->id) {
            return false;
        }

        // Only admins can delete other admin users
        if ($model->hasRole('admin')) {
            return $user->hasRole('admin') && $user->can('delete_users');
        }

        return $user->can('delete_users');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return $user->can('edit_users');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        // Only admins can force delete users
        if ($model->hasRole('admin')) {
            return $user->hasRole('admin') && $user->can('delete_users');
        }

        return $user->can('delete_users');
    }

    /**
     * Determine whether the user can assign roles.
     */
    public function assignRole(User $user, ?User $model = null): bool
    {
        // If checking for a specific user, prevent users from changing their own roles
        if ($model && $user->id === $model->id) {
            return false;
        }

        return $user->can('assign_roles');
    }

    /**
     * Determine whether the user can change a user's role.
     */
    public function changeRole(User $user, User $model): bool
    {
        // Prevent changing your own role
        if ($user->id === $model->id) {
            return false;
        }

        // Only admins can change admin roles
        if ($model->hasRole('admin') && !$user->hasRole('admin')) {
            return false;
        }

        return $user->can('assign_roles');
    }
}
