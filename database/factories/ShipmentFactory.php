<?php
namespace Database\Factories;

use App\Enums\ShipmentStatus;
use App\Models\Shipment;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentFactory extends Factory
{
    protected $model = Shipment::class;

    public function definition(): array
    {
        return [
            'tracking_number' => $this->faker->optional()->regexify('TRK[0-9]{8}'),
            'carrier' => $this->faker->optional()->company(),
            'status' => $this->faker->randomElement(ShipmentStatus::values()),
            'total' => $this->faker->randomFloat(2, 10, 500),
            'notes' => $this->faker->optional()->paragraph(),
        ];
    }
}
