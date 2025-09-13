<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Shipping;
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
        $query = Order::with(['customer', 'items.product']);

        // Search by order number, customer name, status
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('name', 'like', "%{$search}%");
                    })
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'asc');
        $allowedSortFields = ['id', 'order_number', 'status', 'total', 'created_at'];
        $allowedSortOrders = ['asc', 'desc'];
        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('id', 'asc');
        }

        $orders = $query->paginate(15)->appends($request->query());
        $customers = Customer::all();
        $shippings = Shipping::all();
        // dd($orders);
        return Inertia::render('order/index', [
            'orders' => $orders,
            'customers' => $customers,
            'shippings' => $shippings ?? []
        ]);
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(OrderRequest $request)
    {
        DB::beginTransaction();
        try {
            $order = Order::create($request->validated());
            // Save order items
            foreach ($request->order_items as $item) {
                $order->orderItems()->create($item);
            }
            DB::commit();
            return redirect()->route('orders.index')->with('success', 'Order created successfully.');
        } catch (\Exception $e) {
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
            // Update order items
            $order->orderItems()->delete();
            foreach ($request->order_items as $item) {
                $order->orderItems()->create($item);
            }
            DB::commit();
            return redirect()->route('orders.index')->with('success', 'Order updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(Order $order)
    {
        $order->orderItems()->delete();
        $order->delete();
        return redirect()->route('orders.index')->with('success', 'Order deleted successfully.');
    }
}
