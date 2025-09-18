<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShippingRequest;
use App\Models\Customer;
use App\Models\Shipping;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ShippingController extends Controller
{
    /**
     * Display a listing of shippings with search and sorting.
     */
    public function index(Request $request): Response
    {
        $query = Shipping::query()->withCount('orders');

        // Search by tracking number, carrier, or status
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                    ->orWhere('carrier', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'asc');
        $allowedSortFields = ['id', 'tracking_number', 'carrier', 'status', 'total', 'orders_count', 'created_at', 'updated_at'];
        $allowedSortOrders = ['asc', 'desc'];
        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('id', 'asc');
        }

        $shippings = $query->paginate(10)->appends($request->query());

        return Inertia::render('shipping/index', [
            'shippings' => $shippings,
            'filters' => [
                'search' => $request->get('search', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Store a newly created shipping in storage.
     */
    public function store(ShippingRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $shipping = Shipping::create($request->validated());

            DB::commit();

            Log::info('Shipping created successfully', [
                'shipping_id' => $shipping->id,
                'created_by' => auth()->id(),
            ]);

            return Redirect::route('shippings.index')->with('success', 'Shipping created successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to create shipping', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create shipping. Please try again.']);
        }
    }

    /**
     * Update the specified shipping in storage.
     */
    public function update(ShippingRequest $request, Shipping $shipping): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $oldData = $shipping->toArray();
            $shipping->update($request->validated());

            DB::commit();

            Log::info('Shipping updated successfully', [
                'shipping_id' => $shipping->id,
                'old_data' => $oldData,
                'new_data' => $shipping->fresh()->toArray(),
                'updated_by' => auth()->id(),
            ]);

            return Redirect::route('shippings.index')->with('success', 'Shipping updated successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to update shipping', [
                'shipping_id' => $shipping->id,
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update shipping. Please try again.']);
        }
    }

        /**
     * Show a shipping with its orders and customers.
     */
    public function show(Request $request, Shipping $shipping): Response
    {
        // Orders for this shipping with pagination
        $ordersQuery = $shipping->orders()->with('customer')->orderBy('id', 'desc');
        if ($search = $request->get('orders_search')) {
            $ordersQuery->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('total', 'like', "%{$search}%");
            });
        }
        $orders = $ordersQuery->paginate(10, ['*'], 'orders_page')->appends($request->query());

        // Customers that have orders in this shipping (distinct) with pagination
        $customersQuery = $shipping->orders()
            ->select('customer_id')
            ->with('customer')
            ->whereNotNull('customer_id')
            ->groupBy('customer_id');

        // To paginate distinct customers, fetch IDs then query customers
        $customerIds = $customersQuery->pluck('customer_id')->toArray();
        $customersPaginator = Customer::whereIn('id', $customerIds)
            ->orderBy('id', 'desc');
        if ($search = $request->get('customers_search')) {
            $customersPaginator->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }
        $customers = $customersPaginator->paginate(10, ['*'], 'customers_page')->appends($request->query());

        return Inertia::render('shipping/show', [
            'shipping' => $shipping->fresh()->loadCount('orders'),
            'orders' => $orders,
            'customers' => $customers,
            'filters' => [
                'orders_search' => $request->get('orders_search', ''),
                'customers_search' => $request->get('customers_search', ''),
            ],
        ]);
    }

    /**
     * Remove the specified shipping from storage.
     */
    public function destroy(Shipping $shipping): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $shippingData = $shipping->toArray();

            // Prevent delete if referenced by orders
            if ($shipping->orders()->exists()) {
                return Redirect::back()->withErrors([
                    'error' => 'Cannot delete shipping. This shipping is associated with existing orders.'
                ]);
            }

            $shipping->delete();

            DB::commit();

            Log::info('Shipping deleted successfully', [
                'shipping_data' => $shippingData,
                'deleted_by' => auth()->id(),
            ]);

            return Redirect::route('shippings.index')->with('success', 'Shipping deleted successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to delete shipping', [
                'shipping_id' => $shipping->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()->withErrors([
                'error' => 'Failed to delete shipping. Please try again.'
            ]);
        }
    }
}
