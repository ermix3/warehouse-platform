<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'barcode', 'name', 'description',
        'origin', 'hs_code',
        'unit_price', 'net_weight', 'box_weight',
        'category_id', 'supplier_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
