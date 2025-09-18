<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::apiResource('suppliers', SupplierController::class)->except('show');
    Route::apiResource('customers', CustomerController::class)->except('show');
    Route::apiResource('products', ProductController::class)->except('show');
    Route::apiResource('users', UserController::class)->except('show');
    Route::apiResource('shippings', ShippingController::class);
    Route::get('shippings/{shipping}', [ShippingController::class, 'show'])->name('shippings.show');
    Route::post('shippings/{shipping}/customers', [OrderController::class, 'createCustomerAndAttachOrder'])->name('shippings.customers.attachCreate');
    Route::post('shippings/{shipping}/customers/{customer}/attach-order', [OrderController::class, 'attachOrderToShipping'])->name('shippings.customers.attachOrder');
    Route::apiResource('orders', OrderController::class);
    Route::post('orders/{order}/attach-product', [OrderController::class, 'attachProduct'])->name('orders.attachProduct');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
