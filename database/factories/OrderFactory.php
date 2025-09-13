<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Shipping;
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
            'customer_id' => Customer::inRandomOrder()->first()?->id ?? 1,
            'shipping_id' => Shipping::factory(),
        ];
    }

    public function configure(): OrderFactory
    {
        return $this->afterCreating(function (Order $order) {
            $items = OrderItem::factory()
                ->count(rand(1, 10))
                ->create(['order_id' => $order->id]);

            // Recalculate totals
            $total = $items->sum(fn($item) => $item->quantity * $item->unit_price);

            $order->update(['total' => $total]);

            // Update shipping total too
            if ($order->shipping) {
                $order->shipping->update(['total' => $total]);
            }
        });
    }
}
