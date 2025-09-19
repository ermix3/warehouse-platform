<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin@'),
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => Hash::make('test@'),
        ]);

        $this->call([
            UserSeeder::class,
            CustomerSeeder::class,
            SupplierSeeder::class,
            // ShipmentSeeder::class,
            ProductSeeder::class,
            OrderSeeder::class,
            // OrderItemSeeder::class,
        ]);
    }
}
