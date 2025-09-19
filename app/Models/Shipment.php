<?php

namespace App\Models;

use App\Enums\ShipmentStatus;
use Database\Factories\ShipmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shipment extends Model
{
    /** @use HasFactory<ShipmentFactory> */
    use HasFactory;

    protected $fillable = ['tracking_number', 'carrier', 'status', 'total', 'notes'];

    protected $casts = [
        'status' => ShipmentStatus::class,
    ];

    public function orders(): HasMany|Shipment
    {
        return $this->hasMany(Order::class);
    }
}
