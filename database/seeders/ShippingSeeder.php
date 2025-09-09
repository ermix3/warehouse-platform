<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shipping;

class ShippingSeeder extends Seeder
{
    public function run(): void
    {
        Shipping::factory()->count(20)->create();
    }
}

