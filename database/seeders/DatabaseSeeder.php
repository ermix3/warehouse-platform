<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
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
        // Seed roles and permissions first
        $this->call([
            RoleAndPermissionSeeder::class,
        ]);

        // Create demo users with different roles
        $this->createDemoUsers();

        // Seed other data
        $this->call([
            CustomerSeeder::class,
            SupplierSeeder::class,
            ProductSeeder::class,
            OrderSeeder::class,
        ]);
    }

    /**
     * Create demo users with different roles.
     */
    protected function createDemoUsers(): void
    {
        foreach (RolesEnum::cases() as $role) {
            $user = User::firstOrCreate(
                ['email' => $role->value . '@gmail.com'],
                [
                    'name' => ucwords($role->value . ' user'),
                    'password' => Hash::make($role->value . '@'),
                ]
            );

            if (!$user->hasRole($role)) {
                $user->assignRole($role);
            }
        }
    }
}
