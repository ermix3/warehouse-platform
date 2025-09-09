<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'barcode' => $this->faker->unique()->ean13(),
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'origin' => $this->faker->country(),
            'hs_code' => $this->faker->numerify('#######'),
            'net_weight' => $this->faker->randomFloat(2, 0.1, 50),
            'box_weight' => $this->faker->randomFloat(2, 0.1, 10),
            'category_id' => Category::inRandomOrder()->first()?->id ?? 1,
            'supplier_id' => Supplier::inRandomOrder()->first()?->id ?? null,
        ];
    }
}

