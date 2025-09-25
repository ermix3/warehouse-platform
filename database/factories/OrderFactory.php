<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Shipment;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'order_number' => 'ORD-' . now()->format('Ymd') . '-' . $this->faker->unique()->numerify('####'),
            'status' => $this->faker->randomElement(OrderStatus::values()),
            'total' => 0,
            'customer_id' => Customer::inRandomOrder()->first()?->id ?? Customer::factory(),
            'shipment_id' => Shipment::factory(),
            'supplier_id' => Supplier::inRandomOrder()->first()?->id ?? null,
        ];
    }

    public function configure(): OrderFactory
    {
        return $this->afterCreating(function (Order $order) {
            /** @var array<OrderItem> $items */
            $items = OrderItem::factory()
                ->count(rand(1, 10))
                ->create(['order_id' => $order->id]);

            // Recalculate totals using product box quantity and unit price
            $items->load('product');
            $total = $items->sum(function ($item) {
                $product = $item->product;
                if (!$product) {
                    return 0;
                }
                $totQty = (int) $item->ctn * (int) $product->box_qtt;
                return $totQty * (float) $product->unit_price;
            });

            $order->update(['total' => $total]);

            // Update shipment total as the sum of all its orders' totals
            if ($order->shipment) {
                $shipmentTotal = $order->shipment->orders()->sum('total');
                $order->shipment->update(['total' => $shipmentTotal]);
            }
        });
    }
}
