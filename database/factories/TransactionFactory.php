<?php
namespace Database\Factories;

use App\Enums\TransactionType;
use App\Models\Customer;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(TransactionType::values()),
            'value' => $this->faker->randomFloat(2, 1, 10000),
            'notes' => $this->faker->optional()->sentence(),
            'customer_id' => Customer::factory(),
        ];
    }
}

