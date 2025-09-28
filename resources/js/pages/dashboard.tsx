import { OrdersByMonthChart } from '@/components/charts/orders-by-month-chart';
import { OrdersByStatusChart } from '@/components/charts/orders-by-status-chart';
import { RecentOrdersChart } from '@/components/charts/recent-orders-chart';
import { AnalyticsCard } from '@/components/ui/analytics-card';
import AppLayout from '@/layouts/app-layout';
import { getFormattedAmount } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Coins, PackageCheck, ShoppingBasket, Users } from 'lucide-react';

interface DashboardProps {
    analytics: {
        totals: {
            customers: number;
            products: number;
            orders: number;
            revenue: number;
        };
        ordersByMonth: Array<{
            month: string;
            count: number;
            revenue: number;
        }>;
        ordersByStatus: Array<{
            status: string;
            count: number;
        }>;
        recentOrders: Array<{
            id: number;
            total: number;
            created_at: string;
            customer: {
                name: string;
                email: string;
            };
            items: Array<{
                quantity: number;
                product: {
                    name: string;
                };
            }>;
        }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ analytics }: Readonly<DashboardProps>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Analytics Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <AnalyticsCard
                        title="Total Customers"
                        value={analytics.totals.customers.toLocaleString()}
                        icon={Users}
                        description="Active customers"
                    />
                    <AnalyticsCard
                        title="Total Products"
                        value={analytics.totals.products.toLocaleString()}
                        icon={ShoppingBasket}
                        description="Available products"
                    />
                    <AnalyticsCard
                        title="Total Orders"
                        value={analytics.totals.orders.toLocaleString()}
                        icon={PackageCheck}
                        description="Orders placed"
                    />
                    <AnalyticsCard
                        title="Total Revenue"
                        value={getFormattedAmount(analytics.totals.revenue)}
                        icon={Coins}
                        description="Revenue generated"
                    />
                    {/*<AnalyticsCard*/}
                    {/*    title="Low Stock Items"*/}
                    {/*    value={analytics.lowStockProducts.length.toString()}*/}
                    {/*    icon={Package}*/}
                    {/*    description="Items need restocking"*/}
                    {/*    variant="warning"*/}
                    {/*/>*/}
                </div>

                {/* Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                    <OrdersByMonthChart data={analytics.ordersByMonth} />
                    <OrdersByStatusChart data={analytics.ordersByStatus} />
                </div>
                <div className="grid gap-6">
                    <RecentOrdersChart data={analytics.recentOrders} />
                </div>
            </div>
        </AppLayout>
    );
}
