<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Http\Requests\OrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shipping;
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
        $products = Product::all();
        return Inertia::render('order/index', [
            'orders' => $orders,
            'customers' => $customers,
            'shippings' => $shippings ?? [],
            'products' => $products,
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
            $order_items = $request->order_items;
            foreach ($order_items as $oi) {
                $order->items()->create($oi);
            }

            // Recalculate order total based on items and products
            $order->recalculateTotal();

            // Update shipping total if applicable
            if (!empty($order->shipping_id)) {
                $order->refreshShippingTotal();
            }

            DB::commit();
            return redirect()->route('orders.index')->with('success', 'Order created successfully.');
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
            $oldShippingId = $order->shipping_id; // capture before update

            $order->update($request->validated());

            // Replace order items
            $order->items()->delete();
            foreach ($request->order_items as $item) {
                $order->items()->create($item);
            }

            // Recalculate order total based on items and products
            $order->recalculateTotal();

            // Refresh shipping totals (handle shipping change)
            if ($oldShippingId && $oldShippingId !== $order->shipping_id) {
                $order->refreshShippingTotal($oldShippingId);
            }
            if (!empty($order->shipping_id)) {
                $order->refreshShippingTotal();
            }

            DB::commit();
            return redirect()->route('orders.index')->with('success', 'Order updated successfully.');
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
        $shippingId = $order->shipping_id;
        // Delete related items using the correct relation name
        $order->items()->delete();
        $order->delete();

        // After deletion, refresh the shipping total if applicable
        if (!empty($shippingId)) {
            $shipping = Shipping::find($shippingId);
            if ($shipping) {
                $shipping->total = $shipping->orders()->sum('total');
                $shipping->save();
            }
        }

        return redirect()->route('orders.index')->with('success', 'Order deleted successfully.');
    }

    /**
     * Display the specified order with customer and paginated/searchable order items.
     */
    public function show(Request $request, $id): Response
    {
        $order = Order::with(['customer', 'items.product', 'shipping'])->findOrFail($id);
        $customer = $order->customer;
        $products = Product::all();

        // Paginate and search order items
        $itemsQuery = $order->items()->with('product');
        if ($search = $request->get('search')) {
            $itemsQuery->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }
        $orderItems = $itemsQuery->orderByDesc('id')->paginate(10)->appends($request->query());

        return Inertia::render('order/show', [
            'order' => $order,
            'customer' => $customer,
            'orderItems' => $orderItems,
            'products' => $products,
        ]);
    }

    /**
     * Attach a product to the order (add an order item).
     */
    public function attachProduct(Request $request, $id)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'ctn' => 'required|integer|min:1',
        ]);
        $order = Order::findOrFail($id);
        $order->items()->create([
            'product_id' => $request->input('product_id'),
            'ctn' => $request->input('ctn'),
        ]);
        $order->recalculateTotal();
        $order->refreshShippingTotal();
        return redirect()->route('orders.show', $order->id)->with('success', 'Product attached to order.');
    }

    /**
     * Create and attach a blank order (no items) for an existing customer to a shipping.
     */
    public function attachOrderToShipping(Shipping $shipping, Customer $customer)
    {
        $this->createOrderAndRefreshShippingTotal($customer, $shipping);
        return redirect()
            ->route('shippings.show', $shipping->id)
            ->with('success', 'Blank order attached to shipping for customer.');
    }

    /**
     * Create a new customer and attach a blank order to a shipping.
     */
    public function createCustomerAndAttachOrder(CustomerRequest $request, Shipping $shipping)
    {
        $validated = $request->validated();
        $customer = Customer::create($validated);
        $this->createOrderAndRefreshShippingTotal($customer, $shipping);
        return redirect()
            ->route('shippings.show', $shipping->id)
            ->with('success', 'Customer created and order attached to shipping.');
    }

    /**
     * @param Customer $customer
     * @param Shipping $shipping
     * @return void
     */
    public function createOrderAndRefreshShippingTotal(Customer $customer, Shipping $shipping): void
    {
        $order = new Order();
        $order->order_number = 'ORD-' . now()->format('Ymd') . '-' . str_pad((string)(Order::max('id') + 1), 4, '0', STR_PAD_LEFT);
        $order->status = 'pending';
        $order->total = 0;
        $order->customer_id = $customer->id;
        $order->shipping_id = $shipping->id;
        $order->save();

        $order->refreshShippingTotal();
    }
}
