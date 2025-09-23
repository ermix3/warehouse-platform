<?php

namespace App\Http\Controllers;

use App\Exports\ShipmentsExport;
use App\Http\Requests\ShipmentRequest;
use App\Models\Customer;
use App\Models\Shipment;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ShipmentController extends Controller
{
    /**
     * Display a listing of shipments with search and sorting.
     */
    public function index(Request $request): Response
    {
        $query = Shipment::query()->withCount('orders');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                    ->orWhere('carrier', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSortFields = ['id', 'tracking_number', 'carrier', 'status', 'total', 'orders_count', 'created_at', 'updated_at'];
        $allowedSortOrders = ['asc', 'desc'];
        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('id', 'desc');
        }

        $shipments = $query->paginate(10)->appends($request->query());

        return Inertia::render('shipment/index', [
            'shipments' => $shipments,
            'filters' => [
                'search' => $request->get('search', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Store a newly created shipment in storage.
     */
    public function store(ShipmentRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $shipment = Shipment::create($request->validated());

            DB::commit();

            Log::info('Shipment created successfully', [
                'shipment_id' => $shipment->id,
                'created_by' => auth()->id(),
            ]);

            return Redirect::route('shipments.index')->with('success', 'Shipment created successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to create shipment', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create shipment. Please try again.']);
        }
    }

    /**
     * Update the specified shipment in storage.
     */
    public function update(ShipmentRequest $request, Shipment $shipment): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $oldData = $shipment->toArray();
            $shipment->update($request->validated());

            DB::commit();

            Log::info('Shipment updated successfully', [
                'shipment_id' => $shipment->id,
                'old_data' => $oldData,
                'new_data' => $shipment->fresh()->toArray(),
                'updated_by' => auth()->id(),
            ]);

            return Redirect::route('shipments.index')->with('success', 'Shipment updated successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to update shipment', [
                'shipment_id' => $shipment->id,
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update shipment. Please try again.']);
        }
    }

    /**
     * Show a shipment with its orders and customers.
     */
    public function show(Request $request, Shipment $shipment): Response
    {
        // Orders for this shipment with pagination
        $ordersQuery = $shipment->orders()
            ->with('customer')
            ->withCount('items')
            ->orderBy('id', 'desc');
        if ($search = $request->get('orders_search')) {
            $ordersQuery->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('total', 'like', "%{$search}%");
            });
        }
        $orders = $ordersQuery->paginate(10, ['*'], 'orders_page')->appends($request->query());

        // Customers that have orders in this shipment (distinct) with pagination
        $customersQuery = $shipment->orders()
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

        $allCustomers = Customer::get(['id', 'code', 'name']);

        return Inertia::render('shipment/show', [
            'shipment' => $shipment->fresh()->loadCount('orders'),
            'orders' => $orders,
            'customers' => $customers,
            'allCustomers' => $allCustomers,
            'filters' => [
                'orders_search' => $request->get('orders_search', ''),
                'customers_search' => $request->get('customers_search', ''),
                'all_customers_search' => $request->get('all_customers_search', ''),
            ],
        ]);
    }

    /**
     * Remove the specified shipment from storage.
     */
    public function destroy(Shipment $shipment): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $shipmentData = $shipment->toArray();

            // Prevent delete if referenced by orders
            if ($shipment->orders()->exists()) {
                return Redirect::back()->withErrors([
                    'error' => 'Cannot delete shipment. This shipment is associated with existing orders.'
                ]);
            }

            $shipment->delete();

            DB::commit();

            Log::info('Shipment deleted successfully', [
                'shipment_data' => $shipmentData,
                'deleted_by' => auth()->id(),
            ]);

            return Redirect::route('shipments.index')->with('success', 'Shipment deleted successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to delete shipment', [
                'shipment_id' => $shipment->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()->withErrors([
                'error' => 'Failed to delete shipment. Please try again.'
            ]);
        }
    }

    /**
     * Export a specific shipment with detailed product information using ShipmentsExport.
     */
    public function exportData(Request $request, Shipment $shipment)
    {
        $type = strtolower($request->get('type', 'xlsx'));

        if ($type === 'excel') {
            $type = 'xlsx';
        }

        Log::info("Exporting detailed shipment '{$shipment->id}' for type '$type'.");

        $allowed = ['csv', 'xlsx', 'xls', 'ods', 'excel'];
        if (!in_array($type, $allowed)) {
            return Redirect::back()->withErrors(['error' => 'Invalid export type. Allowed types: csv, xlsx, xls, ods']);
        }

        $export = new ShipmentsExport($shipment->id);

        $filename = sprintf('shipment_%s_details_%s.%s',
            $shipment->tracking_number ?? $shipment->id,
            now()->format('Y-m-d_H-i-s'),
            $type
        );

        try {
            return Excel::download($export, $filename);
        } catch (\PhpOffice\PhpSpreadsheet\Exception $e) {
            Log::error('Failed to export shipment (Spreadsheet Exception): ' . $e->getMessage());
            return Redirect::back()->withErrors(['error' => 'Failed to export shipment.']);
        }
    }

}
