<?php

namespace App\Models;

use Database\Factories\CustomerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Customer extends Model
{
    /** @use HasFactory<CustomerFactory> */
    use HasFactory, Searchable;

    public function toSearchableArray()
    {
        return [
            'name'  => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'code'  => $this->code,
        ];
    }

    protected $fillable = ['code', 'name', 'email', 'phone', 'address', 'notes', 'shipping_tax', 'handling_tax'];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
