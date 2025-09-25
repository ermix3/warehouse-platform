<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shipment;
use App\Models\Supplier;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of orders with search, sorting, and relations.
     */
    public function index(Request $request): Response
    {
        $query = Order::with(['customer', 'supplier', 'items.product']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('name', 'like', "%{$search}%");
                    })
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSortFields = ['id', 'order_number', 'status', 'total', 'created_at'];
        $allowedSortOrders = ['asc', 'desc'];
        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('id', 'desc');
        }

        $orders = $query->paginate(15)->appends($request->query());
        $customers = Customer::all();
        $shipments = Shipment::all();
        $products = Product::all();
        $suppliers = Supplier::all();
        return Inertia::render('order/index', [
            'orders' => $orders,
            'customers' => $customers,
            'shipments' => $shipments ?? [],
            'products' => $products,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(OrderRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();
            $order = Order::create($validated);

            // Save order items
            $order->items()->createMany($request->order_items);

            // Recalculate order total based on items and products
            $order->recalculateTotal();

            // Update shipment total if applicable
            $order->refreshShipmentTotal();

            DB::commit();
            return back()->with('success', 'Order created successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }


    /**
     * Update the specified order in storage.
     */
    public function update(OrderRequest $request, Order $order)
    {
        DB::beginTransaction();
        try {
            $order->update($request->validated());

            // Replace order items
            $order->items()->delete();
            $order->items()->createMany($request->order_items);

            // Recalculate order total based on items and products
            $order->recalculateTotal();

            // Refresh shipment totals (handle shipment change)
            $order->refreshShipmentTotal();

            DB::commit();
            return back()->with('success', 'Order updated successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(Order $order)
    {
        $shipmentId = $order->shipment_id;
        // Delete related items using the correct relation name
        $order->items()->delete();
        $succeeded = $order->delete();

        // After deletion, refresh the shipment total if applicable
        if ($succeeded && !empty($shipmentId)) {
            $order->refreshShipmentTotal($shipmentId);
        }

        return back()->with('success', 'Order deleted successfully.');
    }

    /**
     * Display the specified order with customer and paginated/searchable order items.
     */
    public function show(Request $request, $id): Response
    {
        $order = Order::with(['customer', 'items.product', 'shipment'])->findOrFail($id);

        // Paginate and search order items
        $itemsQuery = $order->items()->with('product');
        if ($search = $request->get('search')) {
            $itemsQuery->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }
        $orderItems = $itemsQuery->orderByDesc('id')->paginate(10)->appends($request->query());

        $products = Product::latest()->get();
        $customers = Customer::latest()->get(['id', 'name']);
        $suppliers = Supplier::latest()->get(['id', 'name']);
        $shipments = Shipment::latest()->get(['id', 'tracking_number', 'carrier']);

        return Inertia::render('order/show', [
            'order' => $order,
            'orderItems' => $orderItems,
            'products' => $products,
            'customers' => $customers,
            'suppliers' => $suppliers,
            'shipments' => $shipments,
        ]);
    }
}
