<?php

namespace App\Models;

use App\Enums\ShippingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipping extends Model
{
    /** @use HasFactory<ShippingFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id', 'tracking_number', 'carrier', 'status', 'cost',
    ];

    protected $casts = [
        'status' => ShippingStatus::class,
    ];
}
