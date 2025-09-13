<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers with search and sorting.
     */
    public function index(Request $request): Response
    {
        $query = Customer::query()->withCount([
            'orders as unique_products_bought_count' => function ($query) {
                $query->join('order_items', 'orders.id', '=', 'order_items.order_id')
                      ->selectRaw('count(distinct order_items.product_id)');
            }
        ])
        ->withCount('orders');
        
        // Handle search across multiple fields
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        // Handle sorting with validation
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSortFields = ['id', 'name', 'email', 'phone', 'address', 'notes', 'unique_products_bought_count', 'orders_count'];
        $allowedSortOrders = ['asc', 'desc'];

        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            // Fallback to default sorting
            $query->orderBy('id', 'asc');
        }

        $customers = $query->paginate(15)->appends($request->query());

        return Inertia::render('customer/index', [
            'customers' => $customers,
            'filters' => [
                'search' => $request->get('search', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Store a newly created customer in storage.
     */
    public function store(CustomerRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $customer = Customer::create($request->validated());

            DB::commit();

            Log::info('Customer created successfully', [
                'customer_id' => $customer->id,
                'customer_name' => $customer->name,
                'created_by' => auth()->id(),
            ]);

            return Redirect::route('customers.index')->with('success', 'Customer created successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to create customer', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create customer. Please try again.']);
        }
    }

    /**
     * Update the specified customer in storage.
     */
    public function update(CustomerRequest $request, Customer $customer): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $oldData = $customer->toArray();
            $customer->update($request->validated());

            DB::commit();

            Log::info('Customer updated successfully', [
                'customer_id' => $customer->id,
                'customer_name' => $customer->name,
                'old_data' => $oldData,
                'new_data' => $customer->fresh()->toArray(),
                'updated_by' => auth()->id(),
            ]);

            return Redirect::route('customers.index')->with('success', 'Customer updated successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to update customer', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update customer. Please try again.']);
        }
    }

    /**
     * Remove the specified customer from storage.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $customerData = $customer->toArray();

            // Check if customer has related orders
            if ($customer->orders()->exists()) {
                return Redirect::back()->withErrors([
                    'error' => 'Cannot delete customer. This customer has associated orders.'
                ]);
            }

            $customer->delete();

            DB::commit();

            Log::info('Customer deleted successfully', [
                'customer_data' => $customerData,
                'deleted_by' => auth()->id(),
            ]);

            return Redirect::route('customers.index')->with('success', 'Customer deleted successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to delete customer', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()->withErrors([
                'error' => 'Failed to delete customer. Please try again.'
            ]);
        }
    }
}
