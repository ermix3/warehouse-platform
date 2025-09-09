<?php

use App\Enums\ShippingStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shippings', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number')->nullable();
            $table->string('carrier')->nullable();
            $table->enum('status', ShippingStatus::values())->default(ShippingStatus::PENDING->value);
            $table->decimal('cost', 12, 2)->default(0);

            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shippings');
    }
};
