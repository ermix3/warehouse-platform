<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Customer permissions
            'view_customers',
            'create_customers',
            'edit_customers',
            'delete_customers',

            // Order permissions
            'view_own_orders',
            'view_orders',
            'create_orders',
            'edit_orders',
            'delete_orders',

            // Product permissions
            'view_products',
            'create_products',
            'edit_products',
            'delete_products',

            // Role permissions
            'view_roles',
            'create_roles',
            'edit_roles',
            'delete_roles',

            // Shipment permissions
            'view_shipments',
            'create_shipments',
            'edit_shipments',
            'delete_shipments',
            'export_shipments',
            'track_own_shipments',

            // Supplier permissions
            'view_suppliers',
            'create_suppliers',
            'edit_suppliers',
            'delete_suppliers',

            // User permissions
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => RolesEnum::ADMIN->value]);
        $adminRole->givePermissionTo(Permission::all());

        // Staff - can manage products, orders, shipments
        $staffRole = Role::create(['name' => RolesEnum::STAFF->value]);
        $staffRole->givePermissionTo([
            // Customers (view only)
            'view_customers',

            // Orders
            'view_orders',
            'create_orders',
            'edit_orders',

            // Products
            'view_products',
            'create_products',
            'edit_products',
            'delete_products',

            // Shipments
            'view_shipments',
            'create_shipments',
            'edit_shipments',

            // Suppliers (view only)
            'view_suppliers'
        ]);

        // Accountant - can view all financial data
        $accountantRole = Role::create(['name' => RolesEnum::ACCOUNTANT->value]);
        $accountantRole->givePermissionTo([
            'view_customers',
            'view_orders',
            'view_products',
            'view_suppliers',
            'view_shipments'
        ]);

        // Customer - can view their own orders and invoices
        $customerRole = Role::create(['name' => RolesEnum::CUSTOMER->value]);
        $customerRole->givePermissionTo([
            'view_own_orders',
            'track_own_shipments'
        ]);
    }
}
