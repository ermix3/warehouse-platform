<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->decimal('unit_price', 12, 2)->default(0)->after('product_id');
            $table->integer('box_qtt')->default(1)->after('unit_price');
            $table->integer('sum')->default(0)->after('box_qtt');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['unit_price', 'box_qtt', 'sum']);
        });
    }
};
