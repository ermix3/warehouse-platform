<?php

namespace App\Http\Requests;

use App\Enums\TransactionType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => 'required|string|in:' . implode(',', TransactionType::values()),
            'value' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:2000',
            'customer_id' => 'required|exists:customers,id',
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Transaction type is required.',
            'type.in' => 'Transaction type must be income or outcome.',
            'value.required' => 'Value is required.',
            'value.numeric' => 'Value must be numeric.',
            'value.min' => 'Value must be at least 0.',
            'customer_id.required' => 'Customer is required.',
            'customer_id.exists' => 'Selected customer does not exist.',
            'notes.max' => 'Notes may not be greater than 2000 characters.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'type' => $this->type,
            'value' => is_numeric($this->value) ? (float) $this->value : $this->value,
            'notes' => isset($this->notes) ? trim((string) $this->notes) : null,
        ]);
    }
}

