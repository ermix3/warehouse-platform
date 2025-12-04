<?php

namespace App\Http\Controllers;

use App\Enums\RolesEnum;
use App\Exports\OrdersExport;
use App\Helpers\NumberToWords;
use App\Http\Requests\OrderItemRequest;
use App\Http\Requests\OrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shipment;
use App\Models\Supplier;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class OrderController extends Controller
{
    /**
     * Display a listing of orders with search, sorting, and relations.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        if ($user->hasRole(RolesEnum::CUSTOMER)) {
            $query = Order::with(['customer', 'supplier'])
                ->where('customer_id', $user->id);
        } else {
            $query = Order::with(['customer', 'supplier', 'shipment']);
        }

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
        $this->authorize('create', Order::class);

        try {
            $validated = $request->validated();
            Order::create($validated);
            return back()->with('success', 'Order created successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }


    /**
     * Update the specified order in storage.
     */
    public function update(OrderRequest $request, Order $order)
    {
        $this->authorize('update', $order);

        try {
            $order->update($request->validated());
            return back()->with('success', 'Order updated successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);
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
    public function show(Request $request, Order $order): Response
    {
        $this->authorize('view', $order);

        // Load the order with its relationships
        $order->load(['customer', 'shipment', 'supplier', 'items.product']);

        // Paginate and search order items
        $itemsQuery = $order->items()->with('product');

        if ($search = $request->get('search')) {
            $itemsQuery->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $orderItems = $itemsQuery
            ->orderByDesc('box_code')
            ->orderByDesc('id')
            ->paginate(10)
            ->appends($request->query());

        // Get related data for the form
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

    /**
     * Attach a product to the order (add an order item).
     */
    public function attachOrderItem(Request $request, Order $order)
    {
        // dd($request->all());
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'ctn' => 'required|integer|min:1',
            'box_code' => ['nullable', 'string', function ($attribute, $value, $fail) {
                if ($value && !in_array($value, OrderItem::pluck('box_code')->toArray())) {
                    $fail("The $attribute must be a valid box_code.");
                }
            }]
        ]);
        $product = Product::find($request->product_id);
        $order->items()->create([
            'product_id' => $request->input('product_id'),
            'ctn' => $request->ctn,
            'unit_price' => $product->unit_price,
            'box_qtt' => $product->box_qtt,
            'sum' => $request->ctn * $product->box_qtt,
            'box_code' => $request->box_code ?? OrderItem::getGenerateBoxCode(),
        ]);
        $order->recalculateTotal();
        $order->refreshShipmentTotal();
        return redirect()->route('orders.show', $order->id)->with('success', 'Product attached to order.');
    }

    /**
     * Detach a product from the order (remove an order item).
     */
    public function detachOrderItem(Order $order, OrderItem $orderItem)
    {
        $this->authorize('update', $order);

        // To check if the order item exists in the order
        $order->items()->findOrFail($orderItem->id);
        $orderItem->delete();

        $order->recalculateTotal();
        $order->refreshShipmentTotal();

        return redirect()->route('orders.show', $order->id)->with('success', 'Product detached from order.');
    }

    /**
     * Patch an item in the order
     *
     */
    public function updateOrderItem(Order $order, OrderItem $orderItem, OrderItemRequest $request)
    {
        // $this->authorize('update', $order);
        $data = $request->validated();

        $ctn = $data['ctn'] ?? $orderItem->ctn;
        $unit_price = $data['unit_price'] ?? $orderItem->unit_price;
        $box_qtt = $data['box_qtt'] ?? $orderItem->box_qtt;
        $sum = $data['sum'] ?? ($ctn * $box_qtt);
        $orderItem->update([
            'ctn' => $ctn,
            'unit_price' => $unit_price,
            'box_qtt' => $box_qtt,
            'sum' => $sum,
        ]);

        $order->recalculateTotal();
        $order->refreshShipmentTotal();

        return redirect()->route('orders.show', $order->id)->with('success', 'Product updated in order.');
    }

    /**
     * Export order data in different formats.
     *
     * @param Request $request
     * @param Order $order
     * @return BinaryFileResponse|\Illuminate\Http\Response|View
     */
    public function exportData(Request $request, Order $order)
    {
        // $this->authorize('view', Order::class);

        $format = strtolower($request->get('format', 'xlsx'));

        // Handle Excel/CSV exports
        $export = new OrdersExport($order->id);
        $filename = "invoice-{$order->id}-" . now()->format('YmdHis');

        // Handle PDF export separately
        if ($format === 'pdf') {
            $data = $export->collection();
            $date = $order->created_at->format('Y-m-d');
            $invoiceNumber = 'INV-' . now()->format('Ymd') . ($order->order_number ? substr($order->order_number, -4) : random_int(1000, 9999));

            // Calculate totals
            $totalAmount = $data->sum(fn($item) => $item['totalAmount']);
            $totalCartons = $data->sum(fn($item) => $item['ctn']);
            $totalGrossWeight = $data->sum(fn($item) => $item['grossWeight']);
            $totalNetWeight = $data->sum(fn($item) => $item['netWeight']);


            // Convert total to words
            $amountInWords = NumberToWords::toWords($totalAmount);
            $totalCartonsInWords = NumberToWords::toWords($totalCartons, 'CARTONS');

            $filename .= '.pdf';

            $theView = 'exports.order-invoice';
            if (!$request->get('category') !== null && $request->get('category') === 'packing-list') {
                $theView = 'exports.order-list';
                $filename = str_replace('invoice', 'packing_list', $filename);
            }

            $pdf = Pdf::loadView($theView, compact('data', 'date', 'invoiceNumber', 'totalAmount', 'totalCartons', 'amountInWords', 'totalCartonsInWords', 'totalGrossWeight', 'totalNetWeight'));
//            return $pdf->stream($filename);
            return $pdf->download($filename);
        }

        switch ($format) {
            case 'csv':
                $filename .= '.csv';
                return Excel::download($export, $filename, \Maatwebsite\Excel\Excel::CSV, [
                    'Content-Type' => 'text/csv',
                ]);

            case 'xlsx':
            default:
                $filename .= '.xlsx';
                return Excel::download($export, $filename, \Maatwebsite\Excel\Excel::XLSX, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]);
        }
    }
}
