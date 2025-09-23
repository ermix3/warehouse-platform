<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Http\Requests\OrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shipment;
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
        return Inertia::render('order/index', [
            'orders' => $orders,
            'customers' => $customers,
            'shipments' => $shipments ?? [],
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

            // Update shipment total if applicable
            if (!empty($order->shipment_id)) {
                $order->refreshShipmentTotal();
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
            $oldShipmentId = $order->shipment_id; // capture before update

            $order->update($request->validated());

            // Replace order items
            $order->items()->delete();
            foreach ($request->order_items as $item) {
                $order->items()->create($item);
            }

            // Recalculate order total based on items and products
            $order->recalculateTotal();

            // Refresh shipment totals (handle shipment change)
            if ($oldShipmentId && $oldShipmentId !== $order->shipment_id) {
                $order->refreshShipmentTotal($oldShipmentId);
            }
            if (!empty($order->shipment_id)) {
                $order->refreshShipmentTotal();
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
        $shipmentId = $order->shipment_id;
        // Delete related items using the correct relation name
        $order->items()->delete();
        $order->delete();

        // After deletion, refresh the shipment total if applicable
        if (!empty($shipmentId)) {
            $shipment = Shipment::find($shipmentId);
            if ($shipment) {
                $shipment->total = $shipment->orders()->sum('total');
                $shipment->save();
            }
        }

        return redirect()->route('orders.index')->with('success', 'Order deleted successfully.');
    }

    /**
     * Display the specified order with customer and paginated/searchable order items.
     */
    public function show(Request $request, $id): Response
    {
        $order = Order::with(['customer', 'items.product', 'shipment'])->findOrFail($id);
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
        $order->refreshShipmentTotal();
        return redirect()->route('orders.show', $order->id)->with('success', 'Product attached to order.');
    }

    /**
     * Create and attach a blank order (no items) for an existing customer to a shipment.
     */
    public function attachOrderToShipment(Shipment $shipment, Customer $customer)
    {
        $this->createOrderAndRefreshShipmentTotal($customer, $shipment);
        return redirect()
            ->route('shipments.show', $shipment->id)
            ->with('success', 'Blank order attached to shipment for customer.');
    }

    /**
     * Create a new customer and attach a blank order to a shipment.
     */
    public function createCustomerAndAttachOrder(CustomerRequest $request, Shipment $shipment)
    {
        $validated = $request->validated();
        $customer = Customer::create($validated);
        $this->createOrderAndRefreshShipmentTotal($customer, $shipment);
        return redirect()
            ->route('shipments.show', $shipment->id)
            ->with('success', 'Customer created and order attached to shipment.');
    }

    /**
     * @param Customer $customer
     * @param Shipment $shipment
     * @return void
     */
    public function createOrderAndRefreshShipmentTotal(Customer $customer, Shipment $shipment): void
    {
        $order = new Order();
        $order->order_number = 'ORD-' . now()->format('Ymd') . '-' . str_pad((string)(Order::max('id') + 1), 4, '0', STR_PAD_LEFT);
        $order->status = 'pending';
        $order->total = 0;
        $order->customer_id = $customer->id;
        $order->shipment_id = $shipment->id;
        $order->save();

        $order->refreshShipmentTotal();
    }
}
