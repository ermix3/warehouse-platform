<?php

namespace App\Http\Requests;

use App\Enums\OrderStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
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
            'order_number' => 'required|string|max:255|unique:orders,order_number,' . $this->order?->id,
            'status' => 'required|string|in:' . implode(',', OrderStatus::values()),
            'total' => 'required|numeric|min:0',
            'customer_id' => 'required|exists:customers,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'shipment_id' => 'nullable|exists:shipments,id',
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
            'order_number.required' => 'The order number is required.',
            'order_number.unique' => 'This order number is already in use.',
            'order_number.max' => 'The order number must not exceed 255 characters.',
            'status.required' => 'The order status is required.',
            'status.in' => 'The selected order status is invalid.',
            'total.required' => 'The order total is required.',
            'total.numeric' => 'The order total must be a valid number.',
            'total.min' => 'The order total must be at least 0.',
            'customer_id.required' => 'Please select a customer.',
            'customer_id.exists' => 'The selected customer does not exist.',
            'supplier_id.exists' => 'The selected supplier is invalid.',
            'shipment_id.exists' => 'The selected shipment does not exist.',
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
            'order_number' => 'order number',
            'status' => 'order status',
            'total' => 'order total',
            'customer_id' => 'customer',
            'supplier_id' => 'supplier',
            'shipment_id' => 'shipment',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'order_number' => trim($this->order_number ?? ''),
            'status' => $this->status ?? OrderStatus::DRAFT->value,
            'total' => $this->total ?? 0,
        ]);
    }
}
