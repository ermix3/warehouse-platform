<?php

namespace App\Http\Requests;

use App\Enums\OrderStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class OrderItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ctn' => 'integer|min:1',
            'sum' => 'integer|min:0',
            'unit_price' => 'numeric|min:0',
            'box_qtt' => 'integer|min:1',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ctn.integer' => 'The carton quantity must be a whole number.',
            'ctn.min' => 'The carton quantity must be at least 1.',
            'sum.integer' => 'The total quantity must be a whole number.',
            'sum.min' => 'The total quantity cannot be negative.',
            'unit_price.numeric' => 'The unit price must be a number.',
            'unit_price.min' => 'The unit price cannot be negative.',
            'box_qtt.integer' => 'The box quantity must be a whole number.',
            'box_qtt.min' => 'The box quantity must be at least 1.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'ctn' => 'carton quantity',
            'sum' => 'total quantity',
            'unit_price' => 'unit price',
            'box_qtt' => 'box quantity',
        ];
    }
}
