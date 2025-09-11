<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        // Handle search
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%")
                    ->orWhere('address', 'like', "%$search%")
                    ->orWhere('notes', 'like', "%$search%");
            });
        }

        // Handle ordering
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'asc');

        // Validate sort fields
        $allowedSortFields = [
            'id', 'name', 'email', 'phone', 'address', 'notes'
        ];

        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder === 'desc' ? 'desc' : 'asc');
        }

        $customers = $query->paginate(15)->appends($request->query());
        return Inertia::render('customer/index', [
            'customers' => $customers
        ]);
    }

    public function store(CustomerRequest $request)
    {
        $validated = $request->validated();

        Customer::create($validated);
        return Redirect::route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function update(CustomerRequest $request, Customer $customer)
    {
        $validated = $request->validated();

        $customer->update($validated);
        return Redirect::route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return Redirect::route('customers.index')->with('success', 'Customer deleted successfully.');
    }
}
