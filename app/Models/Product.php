<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{

    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'barcode',
        'name',
        'description',
        'origin',
        'hs_code',
        'unit_price',
        'box_qtt',
        'height',
        'length',
        'width',
        'net_weight',
        'box_weight',
        'supplier_id',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function orderItems(): HasMany|Product
    {
        return $this->hasMany(OrderItem::class);
    }
}
