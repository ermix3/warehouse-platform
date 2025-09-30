<?php

namespace App\Policies;

use App\Models\Shipment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShipmentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_shipments') || $user->hasPermissionTo('track_own_shipments');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Shipment $shipment): bool
    {
        // Allow if user can view all shipments or if they can track their own shipments
        if ($user->hasPermissionTo('view_shipments')) {
            return true;
        }

        // Check if user can track their own shipments and this is their shipment
        if ($user->hasPermissionTo('track_own_shipments') && $shipment->customer_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_shipments');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Shipment $shipment): bool
    {
        return $user->hasPermissionTo('edit_shipments');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Shipment $shipment): bool
    {
        return $user->hasPermissionTo('delete_shipments');
    }
}
