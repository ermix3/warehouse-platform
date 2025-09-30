<?php

namespace App\Policies;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SupplierPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_suppliers');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Supplier $supplier): bool
    {
        return $user->hasPermissionTo('view_suppliers');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_suppliers');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Supplier $supplier): bool
    {
        return $user->hasPermissionTo('edit_suppliers');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Supplier $supplier): bool
    {
        return $user->hasPermissionTo('delete_suppliers');
    }
}
