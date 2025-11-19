<?php

use App\Enums\TransactionType;
use App\Models\Customer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', TransactionType::values());
            $table->decimal('value', 12, 2);
            $table->text('notes')->nullable();

            $table->foreignIdFor(Customer::class)
                ->constrained()
                ->cascadeOnDelete();
            // create_at updated only in edit.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

