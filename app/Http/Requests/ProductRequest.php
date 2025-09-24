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
            'unit_price' => 'required|numeric|min:0|max:999999.99',
            'box_qtt' => 'required|integer|min:1|max:999999',
            'height' => 'required|numeric|min:0|max:999999.99',
            'length' => 'required|numeric|min:0|max:999999.99',
            'width' => 'required|numeric|min:0|max:999999.99',
            'net_weight' => 'required|numeric|min:0|max:999999.99',
            'box_weight' => 'required|numeric|min:0|max:999999.99',
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
            'unit_price.required' => 'The unit price is required.',
            'unit_price.numeric' => 'The unit price must be a valid number.',
            'unit_price.min' => 'The unit price must be greater than or equal to 0.',
            'box_qtt.required' => 'The box quantity is required.',
            'box_qtt.integer' => 'The box quantity must be a valid integer.',
            'box_qtt.min' => 'The box quantity must be at least 1.',
            'height.required' => 'The height is required.',
            'height.numeric' => 'The height must be a valid number.',
            'height.min' => 'The height must be greater than or equal to 0.',
            'length.required' => 'The length is required.',
            'length.numeric' => 'The length must be a valid number.',
            'length.min' => 'The length must be greater than or equal to 0.',
            'width.required' => 'The width is required.',
            'width.numeric' => 'The width must be a valid number.',
            'width.min' => 'The width must be greater than or equal to 0.',
            'net_weight.required' => 'The net weight is required.',
            'net_weight.numeric' => 'The net weight must be a valid number.',
            'net_weight.min' => 'The net weight must be greater than or equal to 0.',
            'box_weight.required' => 'The box weight is required.',
            'box_weight.numeric' => 'The box weight must be a valid number.',
            'box_weight.min' => 'The box weight must be greater than or equal to 0.',
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
            'unit_price' => 'unit price',
            'box_qtt' => 'box quantity',
            'height' => 'height',
            'length' => 'length',
            'width' => 'width',
            'net_weight' => 'net weight',
            'box_weight' => 'box weight',
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
            'unit_price' => is_numeric($this->unit_price) ? (float) $this->unit_price : $this->unit_price,
            'box_qtt' => is_numeric($this->box_qtt) ? (int) $this->box_qtt : $this->box_qtt,
            'height' => is_numeric($this->height) ? (float) $this->height : $this->height,
            'length' => is_numeric($this->length) ? (float) $this->length : $this->length,
            'width' => is_numeric($this->width) ? (float) $this->width : $this->width,
            'net_weight' => is_numeric($this->net_weight) ? (float) $this->net_weight : $this->net_weight,
            'box_weight' => is_numeric($this->box_weight) ? (float) $this->box_weight : $this->box_weight,
        ]);
    }
}
