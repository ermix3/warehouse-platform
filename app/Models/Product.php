<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
    ];

    public function orderItems(): HasMany|Product
    {
        return $this->hasMany(OrderItem::class);
    }
}
