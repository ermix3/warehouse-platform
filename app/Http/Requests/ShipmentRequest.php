<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ShipmentRequest extends FormRequest
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
            'tracking_number' => 'nullable|string|max:255',
            'carrier' => 'nullable|string|max:255',
            'status' => 'required|in:pending,in_transit,delivered,returned',
            'notes' => 'nullable|string|max:255'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'tracking_number' => $this->tracking_number !== null ? trim((string) $this->tracking_number) : null,
            'carrier' => $this->carrier !== null ? trim((string) $this->carrier) : null,
            'status' => $this->status,
            'notes' => $this->notes !== null ? trim((string) $this->notes) : null
        ]);
    }
}


