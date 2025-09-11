<?php

namespace App\Models;

use App\Enums\ShippingStatus;
use Database\Factories\ShippingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shipping extends Model
{
    /** @use HasFactory<ShippingFactory> */
    use HasFactory;

    protected $fillable = ['tracking_number', 'carrier', 'status', 'cost'];

    protected $casts = [
        'status' => ShippingStatus::class,
    ];

    public function orders(): HasMany|Shipping
    {
        return $this->hasMany(Order::class);
    }
}
