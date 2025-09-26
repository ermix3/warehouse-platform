<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get analytics data
        $analytics = $this->getAnalytics();
        return Inertia::render('dashboard', [
            'analytics' => $analytics
        ]);
    }

    private function getAnalytics()
    {
        // Total counts
        $totalCustomers = Customer::count();
        $totalOrders = Order::count();
        $totalRevenue = Order::sum('total') ?? 0;
        $totalProducts = Product::count();


        // Recent orders
        $recentOrders = Order::with(['customer', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return [
            'totals' => [
                'customers' => $totalCustomers,
                'products' => $totalProducts,
                'orders' => $totalOrders,
                'revenue' => $totalRevenue,
            ],
            'ordersByMonth' => $this->getOrdersByMonthChart(),
            'ordersByStatus' => $this->getOrdersByStatus(),
            'recentOrders' => $recentOrders,
        ];
    }
    private function getOrdersByMonthChart()
    {
        $orders = Order::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('count(*) as count'),
            DB::raw('sum(total) as revenue')
        )
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return $orders;
    }

    private function getOrdersByStatus()
    {
        $statuses = \App\Enums\OrderStatus::cases();
        $statusNames = array_column($statuses, 'value');

        $ordersByStatus = Order::select(
            'status',
            DB::raw('count(*) as count')
        )
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        // Ensure all statuses are represented in the result
        $result = [];
        foreach ($statuses as $status) {
            $statusValue = $status->value;
            $result[] = [
                'status' => $statusValue,
                'count' => (int) ($ordersByStatus[$statusValue]->count ?? 0),
            ];
        }

        return $result;
    }
}
