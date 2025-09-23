<?php

namespace App\Models;

use Database\Factories\CustomerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    /** @use HasFactory<CustomerFactory> */
    use HasFactory;

    protected $fillable = ['code', 'name', 'email', 'phone', 'address', 'notes', 'shipping_tax', 'handling_tax'];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
