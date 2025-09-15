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

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shipping(): BelongsTo
    {
        return $this->belongsTo(Shipping::class);
    }

    /**
     * Recalculate the order total from its items and related products.
     */
    public function recalculateTotal(): void
    {
        $this->loadMissing(['items.product']);
        $total = $this->items->sum(function (OrderItem $item) {
            $product = $item->product;
            if (!$product) {
                return 0;
            }
            $totQty = (int) $item->ctn * (int) $product->box_qtt;
            return $totQty * (float) $product->unit_price;
        });
        $this->total = $total;
        $this->save();
    }

    /**
     * Refresh the total on the associated Shipping record.
     * If $shippingId is provided, refresh that shipping; otherwise, use this order's shipping.
     */
    public function refreshShippingTotal(?int $shippingId = null): void
    {
        $shipping = $shippingId ? Shipping::find($shippingId) : $this->shipping;
        if ($shipping) {
            $shippingTotal = $shipping->orders()->sum('total');
            $shipping->total = $shippingTotal;
            $shipping->save();
        }
    }
}
