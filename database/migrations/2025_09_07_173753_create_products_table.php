<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('barcode')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('origin');
            $table->string('hs_code');
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->integer('box_qtt')->default(1);
            $table->decimal('height', 8, 2)->default(0);
            $table->decimal('length', 8, 2)->default(0);
            $table->decimal('width', 8, 2)->default(0);
            $table->decimal('net_weight', 12, 2)->default(0);
            $table->decimal('box_weight', 12, 2)->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
