<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Product extends Model
{

    /** @use HasFactory<ProductFactory> */
    use HasFactory, Searchable;

    public function toSearchableArray()
    {
        return [
            'name'     => $this->name,
            'barcode'  => $this->barcode,
            'hs_code'  => $this->hs_code,
            'origin'   => $this->origin,
        ];
    }

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
