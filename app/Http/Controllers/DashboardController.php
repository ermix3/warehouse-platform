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
            'recentOrders' => $recentOrders,
        ];
    }

    private function getOrdersByMonthChart()
    {
        return DB::table('orders')
            ->select(
                DB::raw("strftime('%Y-%m', created_at) as month"),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total) as revenue')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }
}
