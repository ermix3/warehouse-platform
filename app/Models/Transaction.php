<?php

namespace App\Models;

use App\Enums\TransactionType;
use Database\Factories\TransactionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Transaction extends Model
{
    /** @use HasFactory<TransactionFactory> */
    use HasFactory, Searchable;

    public function toSearchableArray()
    {
        return [
            'notes' => $this->notes,
        ];
    }

    protected $fillable = [
        'type',
        'value',
        'notes',
        'customer_id',
        'created_at',
    ];

    protected $casts = [
        'type' => TransactionType::class,
        'value' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
