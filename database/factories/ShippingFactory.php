<?php
namespace Database\Factories;

use App\Enums\ShippingStatus;
use App\Models\Order;
use App\Models\Shipping;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShippingFactory extends Factory
{
    protected $model = Shipping::class;

    public function definition(): array
    {
        return [
            'order_id' => Order::inRandomOrder()->first()?->id ?? 1,
            'tracking_number' => $this->faker->optional()->regexify('TRK[0-9]{8}'),
            'carrier' => $this->faker->optional()->company(),
            'status' => $this->faker->randomElement(ShippingStatus::values()),
            'cost' => $this->faker->randomFloat(2, 10, 500),
        ];
    }
}
