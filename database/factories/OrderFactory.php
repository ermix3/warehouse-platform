<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Customer;
use App\Models\Order;
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
            'total' => $this->faker->randomFloat(2, 10, 5000),
            'customer_id' => Customer::inRandomOrder()->first()?->id ?? 1,
            'shipping_id' => Shipping::inRandomOrder()->first()?->id ?? 1,
        ];
    }
}
