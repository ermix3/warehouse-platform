<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        $product = Product::inRandomOrder()->first();
        $ctn = $this->faker->numberBetween(1, 5);

        return [
            // 'order_id' => $Order::inRandomOrder()->first()?->id ?? 1,
            'product_id' => $product?->id ?? 1,
            'ctn' => $ctn,
            'unit_price' => $product?->unit_price ?? 0,
            'box_qtt' => $product?->box_qtt ?? 1,
            'sum' => $ctn * $product?->box_qtt ?? 1,
        ];
    }
}
