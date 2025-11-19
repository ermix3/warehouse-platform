<?php

namespace App\Policies;

use App\Enums\RolesEnum;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransactionPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasAnyRole([RolesEnum::ADMIN->value, RolesEnum::OFFICER->value])) {
            return true; // admin/officer can do anything
        }
        return null; // Continue with normal checks
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission('view_transactions', 'view_own_transactions');
    }

    public function view(User $user, Transaction $transaction): bool
    {
        return $user->hasPermissionTo('view_transactions');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_transactions');
    }

    public function update(User $user, Transaction $transaction): bool
    {
        return $user->hasPermissionTo('edit_transactions');
    }

    public function delete(User $user, Transaction $transaction): bool
    {
        return $user->hasPermissionTo('delete_transactions');
    }
}

