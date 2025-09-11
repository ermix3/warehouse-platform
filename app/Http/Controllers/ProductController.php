<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of products with search and sorting.
     */
    public function index(Request $request): Response
    {
        $query = Product::with(['category', 'supplier']);

        // Handle search across multiple fields including relationships
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('barcode', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('origin', 'like', "%{$search}%")
                    ->orWhere('hs_code', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($categoryQuery) use ($search) {
                        $categoryQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('supplier', function ($supplierQuery) use ($search) {
                        $supplierQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Handle sorting with validation
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSortFields = [
            'id', 'barcode', 'name', 'description', 'origin', 'hs_code',
            'net_weight', 'box_weight', 'created_at', 'updated_at'
        ];
        $allowedSortOrders = ['asc', 'desc'];

        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else if ($sortBy === 'category' && in_array($sortOrder, $allowedSortOrders)) {
            $query->leftJoin('categories', 'products.category_id', '=', 'categories.id')
                ->orderBy('categories.name', $sortOrder)
                ->select('products.*');
        } else if ($sortBy === 'supplier' && in_array($sortOrder, $allowedSortOrders)) {
            $query->leftJoin('suppliers', 'products.supplier_id', '=', 'suppliers.id')
                ->orderBy('suppliers.name', $sortOrder)
                ->select('products.*');
        } else {
            // Fallback to default sorting
            $query->orderBy('id', 'asc');
        }

        $products = $query->paginate(10)->appends($request->query());

        return Inertia::render('product/index', [
            'products' => $products,
            'categories' => Category::orderBy('name')->get(),
            'suppliers' => Supplier::orderBy('name')->get(),
            'filters' => [
                'search' => $request->get('search', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ]
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(ProductRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $product = Product::create($request->validated());

            DB::commit();

            Log::info('Product created successfully', [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_barcode' => $product->barcode,
                'category_id' => $product->category_id,
                'supplier_id' => $product->supplier_id,
                'created_by' => auth()->id(),
            ]);

            return Redirect::route('products.index')->with('success', 'Product created successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to create product', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create product. Please try again.']);
        }
    }

    /**
     * Update the specified product in storage.
     */
    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $oldData = $product->toArray();
            $product->update($request->validated());

            DB::commit();

            Log::info('Product updated successfully', [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_barcode' => $product->barcode,
                'old_data' => $oldData,
                'new_data' => $product->fresh()->toArray(),
                'updated_by' => auth()->id(),
            ]);

            return Redirect::route('products.index')->with('success', 'Product updated successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to update product', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update product. Please try again.']);
        }
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $productData = $product->toArray();

            // Check if product has related order items
            if ($product->orderItems()->exists()) {
                return Redirect::back()->withErrors([
                    'error' => 'Cannot delete product. This product has associated orders.'
                ]);
            }

            $product->delete();

            DB::commit();

            Log::info('Product deleted successfully', [
                'product_data' => $productData,
                'deleted_by' => auth()->id(),
            ]);

            return Redirect::route('products.index')->with('success', 'Product deleted successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to delete product', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()->withErrors([
                'error' => 'Failed to delete product. Please try again.'
            ]);
        }
    }
}
