<?php

namespace App\Http\Services;

use App\Enums\RolesEnum;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shipment;
use App\Models\Supplier;
use App\Models\Transaction;

class GlobalSearchService
{
    public function search(string $query, int $limit = 10): array
    {
        return [
            'customers' => $this->searchModel(Customer::class, $query, $limit),
            'suppliers' => $this->searchModel(Supplier::class, $query, $limit),
            'products'  => $this->searchModel(Product::class, $query, $limit),
            'orders'    => $this->searchModel(Order::class, $query, $limit),
            'shipments' => $this->searchModel(Shipment::class, $query, $limit),
            'transactions' => $this->searchModel(Transaction::class, $query, $limit),
        ];
    }

    private function searchModel(string $model, string $query, int $limit)
    {
        $builder = $model::search($query);

        $builder->query(function ($q) use ($model) {
            $user = auth()->user();

            if ($model === Order::class && $user && $user->hasRole(RolesEnum::CUSTOMER)) {
                $q->where('customer_id', $user->id);
            }

            if ($model === Shipment::class && $user && $user->hasRole(RolesEnum::CUSTOMER)) {
                $q->whereHas('orders', fn ($oq) => $oq->where('customer_id', $user->id));
            }

            if ($model === Transaction::class) {
                $q->with('customer');
            }
        });

        return $builder
            ->take($limit)
            ->get()
            ->map(fn($item) => $this->transform($item));
    }

    private function transform($item): array
    {
        return match (true) {
            $item instanceof Customer => [
                'id'    => $item->id,
                'label' => $item->name,
                'subtitle' => $item->email ?? $item->phone,
                'type'  => 'customer',
                'url'   => route('customers.index', ['search' => $item->name]),
            ],

            $item instanceof Supplier => [
                'id'    => $item->id,
                'label' => $item->name,
                'subtitle' => $item->email ?? $item->phone,
                'type'  => 'supplier',
                'url'   => route('suppliers.index', ['search' => $item->name]),
            ],

            $item instanceof Product => [
                'id'    => $item->id,
                'label' => $item->name,
                'subtitle' => $item->barcode,
                'type'  => 'product',
                'url'   => route('products.index', ['search' => $item->name]),
            ],

            $item instanceof Order => [
                'id'    => $item->id,
                'label' => $item->order_number,
                'subtitle' => 'Status: ' . $item->status->value,
                'type'  => 'order',
                'url'   => route('orders.show', $item->id),
            ],

            $item instanceof Shipment => [
                'id'    => $item->id,
                'label' => $item->tracking_number ?: "Shipment #{$item->id}",
                'subtitle' => 'Status: ' . $item->status->value,
                'type'  => 'shipment',
                'url'   => route('shipments.show', $item->id),
            ],

            $item instanceof Transaction => [
                'id'    => $item->id,
                'label' => "Transaction #{$item->id}",
                'subtitle' =>
                    ($item->customer?->name ? $item->customer->name . ' · ' : '')
                    . $item->type->value . ' · ' . $item->value,
                'type'  => 'transaction',
                'url'   => route('transactions.histories', $item->customer->id),
            ],
        };
    }
}
