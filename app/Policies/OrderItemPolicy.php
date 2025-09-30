<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user, Order $order): bool
    {
        // Allow if user can view all orders
        if ($user->hasPermissionTo('view_orders')) {
            return true;
        }
        
        // Or if they can view their own orders and this is their order
        return $user->hasPermissionTo('view_own_orders') && $order->customer_id === $user->id;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, OrderItem $orderItem, Order $order): bool
    {
        // Allow if user can view all orders
        if ($user->hasPermissionTo('view_orders')) {
            return true;
        }
        
        // Or if they can view their own orders and this is their order
        return $user->hasPermissionTo('view_own_orders') && $order->customer_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Order $order): bool
    {
        // Only allow adding items to unprocessed orders
        if ($order->isProcessed()) {
            return false;
        }
        
        // Allow if user can create orders
        if ($user->hasPermissionTo('create_orders')) {
            return true;
        }
        
        // Or if they can edit orders and this is their order
        return $user->hasPermissionTo('edit_orders') && $order->customer_id === $user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, OrderItem $orderItem, Order $order): bool
    {
        // Only allow updates to items in unprocessed orders
        if ($order->isProcessed()) {
            return false;
        }
        
        // Allow if user can edit orders
        if ($user->hasPermissionTo('edit_orders')) {
            return true;
        }
        
        // Or if they can edit their own orders and this is their order
        return $user->hasPermissionTo('edit_own_orders') && $order->customer_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, OrderItem $orderItem, Order $order): bool
    {
        // Only allow deletion of items in unprocessed orders
        if ($order->isProcessed()) {
            return false;
        }
        
        // Allow if user can delete orders
        if ($user->hasPermissionTo('delete_orders')) {
            return true;
        }
        
        // Or if they can edit their own orders and this is their order
        return $user->hasPermissionTo('edit_own_orders') && $order->customer_id === $user->id;
    }
}
