<?php

namespace App\Http\Controllers;

use App\Http\Requests\SupplierRequest;
use App\Models\Supplier;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    /**
     * Display a listing of suppliers with search and sorting.
     */
    public function index(Request $request): Response
    {
        $query = Supplier::query()->withCount('products');

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

        $allowedSortFields = ['id', 'name', 'email', 'phone', 'address', 'notes', 'products_count', 'created_at'];
        $allowedSortOrders = ['asc', 'desc'];

        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            // Fallback to default sorting
            $query->orderBy('id', 'asc');
        }

        $suppliers = $query->paginate(15)->appends($request->query());

        return Inertia::render('supplier/index', [
            'suppliers' => $suppliers,
            'filters' => [
                'search' => $request->get('search', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Store a newly created supplier in storage.
     */
    public function store(SupplierRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $supplier = Supplier::create($request->validated());

            DB::commit();

            Log::info('Supplier created successfully', [
                'supplier_id' => $supplier->id,
                'supplier_name' => $supplier->name,
                'created_by' => auth()->id(),
            ]);

            return Redirect::route('suppliers.index')->with('success', 'Supplier created successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to create supplier', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create supplier. Please try again.']);
        }
    }

    /**
     * Update the specified supplier in storage.
     */
    public function update(SupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $oldData = $supplier->toArray();
            $supplier->update($request->validated());

            DB::commit();

            Log::info('Supplier updated successfully', [
                'supplier_id' => $supplier->id,
                'supplier_name' => $supplier->name,
                'old_data' => $oldData,
                'new_data' => $supplier->fresh()->toArray(),
                'updated_by' => auth()->id(),
            ]);

            return Redirect::route('suppliers.index')->with('success', 'Supplier updated successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to update supplier', [
                'supplier_id' => $supplier->id,
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update supplier. Please try again.']);
        }
    }

    /**
     * Remove the specified supplier from storage.
     */
    public function destroy(Supplier $supplier): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $supplierData = $supplier->toArray();

            // Check if supplier has related products
            if ($supplier->products()->exists()) {
                return Redirect::back()->withErrors([
                    'error' => 'Cannot delete supplier. This supplier has associated products.'
                ]);
            }

            $supplier->delete();

            DB::commit();

            Log::info('Supplier deleted successfully', [
                'supplier_data' => $supplierData,
                'deleted_by' => auth()->id(),
            ]);

            return Redirect::route('suppliers.index')->with('success', 'Supplier deleted successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to delete supplier', [
                'supplier_id' => $supplier->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()->withErrors([
                'error' => 'Failed to delete supplier. Please try again.'
            ]);
        }
    }
}
