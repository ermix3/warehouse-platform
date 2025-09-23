<?php
namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'code' => 'CUST-' . $this->faker->unique()->numerify('#####'),
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'notes' => $this->faker->sentence(),
            'shipping_tax' => $this->faker->randomFloat(2, 0, 20), // 0% to 20%
            'handling_tax' => $this->faker->randomFloat(2, 0, 20), // 0% to 20%
        ];
    }
}
