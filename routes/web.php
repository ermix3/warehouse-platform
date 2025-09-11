<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::apiResource('categories', CategoryController::class)->except('show');
    Route::apiResource('suppliers', SupplierController::class)->except('show');
    Route::apiResource('customers', CustomerController::class)->except('show');
    Route::apiResource('products', ProductController::class)->except('show');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
