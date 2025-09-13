<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories with search and sorting.
     */
    public function index(Request $request): Response
    {
        $query = Category::query()->withCount('products');

        // Handle search across multiple fields
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Handle sorting with validation
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSortFields = ['id', 'name', 'description', 'products_count', 'created_at'];
        $allowedSortOrders = ['asc', 'desc'];

        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            // Fallback to default sorting
            $query->orderBy('id', 'asc');
        }

        $categories = $query->paginate(15)->appends($request->query());

        return Inertia::render('category/index', [
            'categories' => $categories,
            'filters' => [
                'search' => $request->get('search', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(CategoryRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $category = Category::create($request->validated());

            DB::commit();

            Log::info('Category created successfully', [
                'category_id' => $category->id,
                'category_name' => $category->name,
                'created_by' => auth()->id(),
            ]);

            return Redirect::route('categories.index')->with('success', 'Category created successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to create category', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create category. Please try again.']);
        }
    }

    /**
     * Update the specified category in storage.
     */
    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $oldData = $category->toArray();
            $category->update($request->validated());

            DB::commit();

            Log::info('Category updated successfully', [
                'category_id' => $category->id,
                'category_name' => $category->name,
                'old_data' => $oldData,
                'new_data' => $category->fresh()->toArray(),
                'updated_by' => auth()->id(),
            ]);

            return Redirect::route('categories.index')->with('success', 'Category updated successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to update category', [
                'category_id' => $category->id,
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update category. Please try again.']);
        }
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $categoryData = $category->toArray();

            // Check if category has related products
            if ($category->products()->exists()) {
                return Redirect::back()->withErrors([
                    'error' => 'Cannot delete category. This category has associated products.'
                ]);
            }

            $category->delete();

            DB::commit();

            Log::info('Category deleted successfully', [
                'category_data' => $categoryData,
                'deleted_by' => auth()->id(),
            ]);

            return Redirect::route('categories.index')->with('success', 'Category deleted successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to delete category', [
                'category_id' => $category->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()->withErrors([
                'error' => 'Failed to delete category. Please try again.'
            ]);
        }
    }
}
