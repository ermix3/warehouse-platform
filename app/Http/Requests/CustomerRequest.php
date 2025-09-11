<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:customers,email,' . $this->customer?->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:2000',
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
            'name.required' => 'The customer name is required.',
            'name.max' => 'The customer name must not exceed 255 characters.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email address is already registered to another customer.',
            'phone.max' => 'The phone number must not exceed 20 characters.',
            'address.max' => 'The address must not exceed 1000 characters.',
            'notes.max' => 'The notes must not exceed 2000 characters.',
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
            'name' => 'customer name',
            'email' => 'email address',
            'phone' => 'phone number',
            'address' => 'address',
            'notes' => 'notes',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim($this->name ?? ''),
            'email' => trim($this->email ?? '') ?: null,
            'phone' => trim($this->phone ?? '') ?: null,
            'address' => trim($this->address ?? '') ?: null,
            'notes' => trim($this->notes ?? '') ?: null,
        ]);
    }
}
