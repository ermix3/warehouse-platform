<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GlobalSearchController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('Dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/search', GlobalSearchController::class)->name('global-search');

    Route::apiResource('suppliers', SupplierController::class)->except('show');

    Route::apiResource('customers', CustomerController::class)->except('show');

    Route::apiResource('products', ProductController::class)->except('show');

    Route::apiResource('users', UserController::class)->except('show');

    Route::apiResource('shipments', ShipmentController::class);
    Route::get('/shipments/{shipment}/export-data', [ShipmentController::class, 'exportData'])->name('shipments.exportData');

    Route::apiResource('orders', OrderController::class);

    Route::apiResource('roles', RoleController::class)->except('show');
    Route::prefix('orders/{order}/order-items')
        ->name('orders.')
        ->group(function () {
            Route::post('', [OrderController::class, 'attachOrderItem'])->name('attachProduct');
            Route::delete('{orderItem}', [OrderController::class, 'detachOrderItem'])->name('detachProduct');
            Route::patch('{orderItem}', [OrderController::class, 'updateOrderItem'])->name('updateOrderItem');
        });

    Route::get('transactions/{type?}', [TransactionController::class, 'index'])->name('transactions.index');
    Route::apiResource('transactions', TransactionController::class)->except('index');
    Route::get('transactions/{customer}/histories', [TransactionController::class, 'histories'])->name('transactions.histories');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
