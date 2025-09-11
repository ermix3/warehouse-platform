<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
        $productId = $this->product instanceof Product ? $this->product->id : $this->product;

        return [
            'barcode' => 'required|string|max:255|unique:products,barcode,' . $productId,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'origin' => 'required|string|max:255',
            'hs_code' => 'required|string|max:255',
            'net_weight' => 'required|numeric|min:0|max:999999.99',
            'box_weight' => 'required|numeric|min:0|max:999999.99',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
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
            'barcode.required' => 'The product barcode is required.',
            'barcode.unique' => 'This barcode already exists for another product.',
            'name.required' => 'The product name is required.',
            'name.max' => 'The product name must not exceed 255 characters.',
            'description.max' => 'The description must not exceed 2000 characters.',
            'origin.required' => 'The origin is required.',
            'hs_code.required' => 'The HS code is required.',
            'net_weight.required' => 'The net weight is required.',
            'net_weight.numeric' => 'The net weight must be a valid number.',
            'net_weight.min' => 'The net weight must be greater than or equal to 0.',
            'box_weight.required' => 'The box weight is required.',
            'box_weight.numeric' => 'The box weight must be a valid number.',
            'box_weight.min' => 'The box weight must be greater than or equal to 0.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'The selected category is invalid.',
            'supplier_id.exists' => 'The selected supplier is invalid.',
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
            'barcode' => 'barcode',
            'name' => 'product name',
            'description' => 'description',
            'origin' => 'origin',
            'hs_code' => 'HS code',
            'net_weight' => 'net weight',
            'box_weight' => 'box weight',
            'category_id' => 'category',
            'supplier_id' => 'supplier',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'barcode' => trim($this->barcode ?? ''),
            'name' => trim($this->name ?? ''),
            'description' => trim($this->description ?? '') ?: null,
            'origin' => trim($this->origin ?? ''),
            'hs_code' => trim($this->hs_code ?? ''),
            'net_weight' => is_numeric($this->net_weight) ? (float) $this->net_weight : $this->net_weight,
            'box_weight' => is_numeric($this->box_weight) ? (float) $this->box_weight : $this->box_weight,
            'category_id' => is_numeric($this->category_id) ? (int) $this->category_id : $this->category_id,
            'supplier_id' => $this->supplier_id && is_numeric($this->supplier_id) ? (int) $this->supplier_id : null,
        ]);
    }
}
