<?php

namespace Database\Factories;

use App\Models\Product;
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
            'unit_price' => $this->faker->randomFloat(2, 1, 1000),
            'box_qtt' => $this->faker->numberBetween(1, 100),
            'height' => $this->faker->randomFloat(2, 1, 50),
            'length' => $this->faker->randomFloat(2, 1, 50),
            'width' => $this->faker->randomFloat(2, 1, 50),
            'net_weight' => $this->faker->randomFloat(2, 0.1, 50),
            'box_weight' => $this->faker->randomFloat(2, 0.1, 10),
        ];
    }
}

