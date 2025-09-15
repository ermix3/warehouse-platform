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
            'shipping_id' => 'nullable|exists:shippings,id',
            'order_items' => 'required|array|min:1',
            'order_items.*.product_id' => 'required|exists:products,id',
            'order_items.*.ctn' => 'required|integer|min:1',
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
            'shipping_id.exists' => 'The selected shipping does not exist.',
            'order_items.required' => 'At least one order item is required.',
            'order_items.array' => 'Order items must be provided as an array.',
            'order_items.min' => 'At least one order item is required.',
            'order_items.*.product_id.required' => 'Please select a product for each order item.',
            'order_items.*.product_id.exists' => 'The selected product does not exist.',
            'order_items.*.ctn.required' => 'Please specify the carton quantity for each order item.',
            'order_items.*.ctn.integer' => 'The carton quantity must be a whole number.',
            'order_items.*.ctn.min' => 'The carton quantity must be at least 1.',
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
            'shipping_id' => 'shipping',
            'order_items' => 'order items',
            'order_items.*.product_id' => 'product',
            'order_items.*.ctn' => 'carton quantity',
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
