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

    protected $fillable = ['order_number',  'status', 'total', 'customer_id', 'shipment_id'];

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

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
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
     * Refresh the total on the associated Shipment record.
     * If $shipmentId is provided, refresh that shipment; otherwise, use this order's shipment.
     */
    public function refreshShipmentTotal(?int $shipmentId = null): void
    {
        $shipment = $shipmentId ? Shipment::find($shipmentId) : $this->shipment;
        if ($shipment) {
            $shipmentTotal = $shipment->orders()->sum('total');
            $shipment->total = $shipmentTotal;
            $shipment->save();
        }
    }
}
