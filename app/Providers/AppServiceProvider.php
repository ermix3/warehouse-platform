<?php

namespace App\Providers;

use App\Enums\OrderStatus;
use App\Enums\ShippingStatus;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share enum values with Inertia
        Inertia::share([
            'enums' => [
                'orderStatus' => $this->formatEnum(OrderStatus::class),
                'shippingStatus' => $this->formatEnum(ShippingStatus::class),
            ],
        ]);
    }

    /**
     * Format enum for frontend use
     */
    private function formatEnum(string $enumClass): array
    {
        $cases = $enumClass::cases();
        $result = [];

        foreach ($cases as $case) {
            $result[$case->name] = [
                'name' => $case->name,
                'value' => $case->value,
                'label' => ucwords(str_replace('_', ' ', $case->value)),
            ];
        }

        return $result;
    }
}
