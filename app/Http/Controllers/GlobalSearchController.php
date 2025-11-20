<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\Order;
use App\Models\Shipment;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GlobalSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = trim((string) $request->get('q', ''));
        $perType = (int) $request->get('limit', 10);

        if ($query === '' || Str::length($query) < 2) {
            return response()->json([
                'query' => $query,
                'results' => [
                    'customers' => [],
                    'suppliers' => [],
                    'products' => [],
                    'orders' => [],
                    'shipments' => [],
                    'transactions' => [],
                ],
            ]);
        }

        $results = [
            'customers' => Customer::query()
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%")
                        ->orWhere('phone', 'like', "%{$query}%")
                        ->orWhere('code', 'like', "%{$query}%");
                })
                ->limit($perType)
                ->get()
                ->map(function (Customer $customer) {
                    return [
                        'id' => $customer->id,
                        'label' => $customer->name,
                        'subtitle' => $customer->email ?: $customer->phone,
                        'type' => 'customer',
                        'url' => route('customers.index', ['search' => $customer->name]),
                    ];
                }),

            'suppliers' => Supplier::query()
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%")
                        ->orWhere('phone', 'like', "%{$query}%")
                        ->orWhere('code', 'like', "%{$query}%");
                })
                ->limit($perType)
                ->get()
                ->map(function (Supplier $supplier) {
                    return [
                        'id' => $supplier->id,
                        'label' => $supplier->name,
                        'subtitle' => $supplier->email ?: $supplier->phone,
                        'type' => 'supplier',
                        'url' => route('suppliers.index', ['search' => $supplier->name]),
                    ];
                }),

            'products' => Product::query()
                ->where(function ($q) use ($query) {
                    $q->where('barcode', 'like', "%{$query}%")
                        ->orWhere('name', 'like', "%{$query}%")
                        ->orWhere('hs_code', 'like', "%{$query}%")
                        ->orWhere('origin', 'like', "%{$query}%");
                })
                ->limit($perType)
                ->get()
                ->map(function (Product $product) {
                    return [
                        'id' => $product->id,
                        'label' => $product->name,
                        'subtitle' => $product->barcode,
                        'type' => 'product',
                        'url' => route('products.index', ['search' => $product->name]),
                    ];
                }),

            'orders' => Order::query()
                ->with('customer')
                ->where(function ($q) use ($query) {
                    $q->where('order_number', 'like', "%{$query}%")
                        ->orWhere('status', 'like', "%{$query}%");
                })
                ->limit($perType)
                ->get()
                ->map(function (Order $order) {
                    return [
                        'id' => $order->id,
                        'label' => $order->order_number,
                        'subtitle' => 'Status: ' . $order->status->value,
                        'type' => 'order',
                        'url' => route('orders.show', ['order' => $order->id]),
                    ];
                }),

            'shipments' => Shipment::query()
                ->where(function ($q) use ($query) {
                    $q->where('tracking_number', 'like', "%{$query}%")
                        ->orWhere('carrier', 'like', "%{$query}%")
                        ->orWhere('status', 'like', "%{$query}%");
                })
                ->limit($perType)
                ->get()
                ->map(function (Shipment $shipment) {
                    return [
                        'id' => $shipment->id,
                        'label' => $shipment->tracking_number ?: ('Shipment #' . $shipment->id),
                        'subtitle' => 'Status: ' . $shipment->status->value,
                        'type' => 'shipment',
                        'url' => route('shipments.show', ['shipment' => $shipment->id]),
                    ];
                }),

            'transactions' => Transaction::query()
                ->with('customer')
                ->where(function ($q) use ($query) {
                    $q->where('notes', 'like', "%{$query}%")
                        ->orWhere('type', 'like', "%{$query}%")
                        ->orWhere('value', 'like', "%{$query}%");
                })
                ->limit($perType)
                ->get()
                ->map(function (Transaction $transaction) {
                    return [
                        'id' => $transaction->id,
                        'label' => 'Transaction #' . $transaction->id,
                        'subtitle' => ($transaction->customer ? $transaction->customer->name . ' · ' : '') . $transaction->type->value . ' · ' . $transaction->value,
                        'type' => 'transaction',
                        'url' => route('transactions.index', ['search' => $transaction->id]),
                    ];
                }),
        ];

        return response()->json([
            'query' => $query,
            'results' => $results,
        ]);
    }
}
