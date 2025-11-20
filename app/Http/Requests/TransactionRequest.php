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
        $rules = [
            'type' => 'required|string|in:' . implode(',', TransactionType::values()),
            'value' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:2000',
            'customer_id' => 'required|exists:customers,id',
        ];

        if ($this->isMethod('patch') || $this->isMethod('put')) {
            $rules['created_at'] = 'required|date|before_or_equal:now';
        }

        return $rules;
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
            'created_at.required' => 'Created at is required.',
            'created_at.date' => 'Created at must be a valid date.',
            'created_at.before_or_equal' => 'Created at must be before or equal to today.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $merge = [
            'type' => $this->type,
            'value' => is_numeric($this->value) ? (float) $this->value : $this->value,
            'notes' => isset($this->notes) ? trim((string) $this->notes) : null,
        ];

        if ($this->isMethod('patch') || $this->isMethod('put')) {
            $merge['created_at'] = isset($this->created_at) ? $this->created_at : null;
        }

        $this->merge($merge);
    }
}

