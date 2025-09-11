<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    protected $fillable = ['order_number',  'status', 'total', 'customer_id', 'shipping_id'];

    protected $casts = [
        'status' => OrderStatus::class,
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): Order|HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shipping(): BelongsTo
    {
        return $this->belongsTo(Shipping::class);
    }
}
