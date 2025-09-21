<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('Dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::apiResource('suppliers', SupplierController::class)->except('show');

    Route::apiResource('customers', CustomerController::class)->except('show');

    Route::apiResource('products', ProductController::class)->except('show');

    Route::apiResource('users', UserController::class)->except('show');

    Route::apiResource('shipments', ShipmentController::class);
    Route::prefix('shipments')->name('shipments.')->group(function () {
        Route::prefix('{shipment}')->group(function () {
            Route::get('/', [ShipmentController::class, 'show'])->name('show');
            Route::get('export-data', [ShipmentController::class, 'exportData'])->name('exportData');

            Route::prefix('customers')->name('customers.')->group(function () {
                Route::post('/', [OrderController::class, 'createCustomerAndAttachOrder'])->name('attachCreate');
                Route::post('{customer}/attach-order', [OrderController::class, 'attachOrderToShipment'])->name('attachOrder');
            });
        });
    });

    Route::apiResource('orders', OrderController::class);
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::post('{order}/attach-product', [OrderController::class, 'attachProduct'])->name('attachProduct');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
