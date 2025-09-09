<?php
namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        $order = Order::inRandomOrder()->first();
        $product = Product::inRandomOrder()->first();
        $quantity = $this->faker->numberBetween(1, 10);
        $unit_price = $product?->unit_price ?? $this->faker->randomFloat(2, 10, 500);
        return [
            'order_id' => $order?->id ?? 1,
            'product_id' => $product?->id ?? 1,
            'quantity' => $quantity,
            'unit_price' => $unit_price,
        ];
    }
}

