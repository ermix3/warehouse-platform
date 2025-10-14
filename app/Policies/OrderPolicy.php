<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_orders') || $user->hasPermissionTo('view_own_orders');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Order $order): bool
    {
        // Allow if user can view all orders
        if ($user->hasPermissionTo('view_orders')) {
            return true;
        }

        // Or if they're the customer and can view their own orders
        if ($user->hasPermissionTo('view_own_orders') && $order->customer_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_orders');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Order $order): bool
    {
        // Only allow updates if the order is not yet processed
        return $user->hasPermissionTo('edit_orders');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Order $order): bool
    {
        // Only allow deletion if the order is not yet processed
        return $user->hasPermissionTo('delete_orders');
    }

    /**
     * Determine whether the user can process the order.
     */
    public function process(User $user, Order $order): bool
    {
        return $user->hasPermissionTo('process_orders');
    }
}
