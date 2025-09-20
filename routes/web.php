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
    Route::get('shipments/export-data', [ShipmentController::class, 'exportData'])->name('shipments.exportData');
    Route::apiResource('shipments', ShipmentController::class);
    Route::get('shipments/{shipment}', [ShipmentController::class, 'show'])->name('shipments.show');
    Route::post('shipments/{shipment}/customers', [OrderController::class, 'createCustomerAndAttachOrder'])->name('shipments.customers.attachCreate');
    Route::post('shipments/{shipment}/customers/{customer}/attach-order', [OrderController::class, 'attachOrderToShipment'])->name('shipments.customers.attachOrder');
    Route::apiResource('orders', OrderController::class);
    Route::post('orders/{order}/attach-product', [OrderController::class, 'attachProduct'])->name('orders.attachProduct');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
