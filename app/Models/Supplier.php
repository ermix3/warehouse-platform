<?php

namespace App\Models;

use Database\Factories\SupplierFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Supplier extends Model
{
    /** @use HasFactory<SupplierFactory> */
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

    protected $fillable = ['code', 'name', 'email', 'phone', 'address', 'notes'];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
