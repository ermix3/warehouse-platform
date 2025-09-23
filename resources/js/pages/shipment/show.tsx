import { attachOrderToShipment } from '@/actions/App/Http/Controllers/OrderController';
import { ExportData, Pagination } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import AppLayout from '@/layouts/app-layout';
import { ShipmentStatusBadge } from '@/lib/shipment-status-helper';
import { getFormatedAmount } from '@/lib/utils';
import { dashboard } from '@/routes';
import { show as showOrders } from '@/routes/orders';
import { exportData, index, show } from '@/routes/shipments';
import { attachCreate } from '@/routes/shipments/customers';
import type { BreadcrumbItem, Customer, Order, ShowShipmentProps } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { TextSearch } from 'lucide-react';
import { useState } from 'react';

export default function ShipmentShowPage() {
    const { shipment, orders, customers, filters, flash, allCustomers } = usePage<ShowShipmentProps>().props;

    const [ordersSearch, setOrdersSearch] = useState(filters.orders_search ?? '');
    const [customersSearch, setCustomersSearch] = useState(filters.customers_search ?? '');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [noCustomerFound, setNoCustomerFound] = useState(false);

    const form = useForm({
        code: '',
        name: '',
        phone: '',
    });

    const onCreateAttach = (e: React.FormEvent) => {
        e.preventDefault();
        form.clearErrors();
        form.post(attachCreate.url(shipment.id), {
            onSuccess: () => {
                form.reset();
            },
            onError: (errors) => {
                form.setError(errors);
            },
            preserveScroll: true,
        });
    };

    const attachOrder = (customerId: number) => {
        router.post(attachOrderToShipment.url({ shipment: shipment.id, customer: customerId }), {}, { preserveScroll: true });
    };

    const searchOrders = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(show.url(shipment.id), { ...filters, orders_search: ordersSearch }, { preserveScroll: true });
    };

    const searchCustomers = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(show.url(shipment.id), { ...filters, customers_search: customersSearch }, { preserveScroll: true });
    };

    const onAttachSelected = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomerId) return;
        attachOrder(Number(selectedCustomerId));
    };

    const customerOptions = allCustomers.map((c) => ({
        value: c.id.toString(),
        label: `${c.code} - ${c.name}`,
    }));

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard.url(),
        },
        {
            title: 'Shipments',
            href: index.url(),
        },
        {
            title: `${shipment?.tracking_number ?? shipment.id}`,
            href: show.url(shipment.id),
        },
        {
            title: 'Details shipment',
            href: '',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title={`Shipment #${shipment.id}`} />
            <div className="container mt-5 space-y-6 px-5">
                {/* Shipment info */}
                <Card className="px-2 py-3">
                    <CardHeader className="flex items-center justify-between gap-2 border-b-1 border-b-gray-100 pb-2">
                        <CardTitle>Shipment Info</CardTitle>
                        <ExportData
                            btnSize={'icon'}
                            onExport={(type) => {
                                const q = { type };
                                window.location.href = exportData.url({ shipment: shipment.id }, { query: q });
                            }}
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <Label className="text-md font-bold">Tracking Number</Label>
                                <div className="mt-2 text-sm font-medium">{shipment?.tracking_number ?? '-'}</div>
                            </div>
                            <div>
                                <Label className="text-md font-bold">Carrier</Label>
                                <div className="mt-2 text-sm font-medium">{shipment?.carrier ?? '-'}</div>
                            </div>
                            <div>
                                <Label className="text-md font-bold">Status</Label>
                                <div className="mt-2 text-sm font-medium capitalize">
                                    {shipment?.status ? <ShipmentStatusBadge status={shipment.status} /> : '-'}
                                </div>
                            </div>
                            <div>
                                <Label className="text-md font-bold">Total</Label>
                                <div className="mt-2 text-sm font-medium"> {getFormatedAmount(shipment.total)}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Customers table and Create/Attach */}
                <Card>
                    <CardHeader className="flex flex-col gap-2">
                        <CardTitle>Customers</CardTitle>
                        <form onSubmit={searchCustomers} className="flex gap-2">
                            <Input value={customersSearch} onChange={(e) => setCustomersSearch(e.target.value)} placeholder="Search customers..." />
                            <Button type="submit">Search</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <details className="rounded border p-3">
                                <summary className="cursor-pointer font-medium">Attach Customer</summary>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="no-customer-found"
                                            checked={noCustomerFound}
                                            onCheckedChange={(v) => setNoCustomerFound(Boolean(v))}
                                        />
                                        <Label htmlFor="no-customer-found">No customer found</Label>
                                    </div>

                                    {!noCustomerFound ? (
                                        <form onSubmit={onAttachSelected} className="grid grid-cols-1 gap-3 md:grid-cols-4">
                                            <div className="md:col-span-2">
                                                <Label htmlFor="customer-select">Select Customer</Label>
                                                <SearchableSelect
                                                    options={customerOptions}
                                                    value={selectedCustomerId}
                                                    onValueChange={(value) => setSelectedCustomerId(value)}
                                                    placeholder="Search and select product..."
                                                />
                                            </div>

                                            <div className="flex items-end space-x-2">
                                                <Button type="submit" disabled={!selectedCustomerId}>
                                                    Attach Order
                                                </Button>
                                                {selectedCustomerId && (
                                                    <Button type="button" variant="outline" onClick={() => setSelectedCustomerId('')}>
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </form>
                                    ) : (
                                        <form onSubmit={onCreateAttach} className="grid grid-cols-1 gap-3 md:grid-cols-4">
                                            <div>
                                                <Label htmlFor="code_inline">Code</Label>
                                                <Input
                                                    id="code_inline"
                                                    value={form.data.code}
                                                    onChange={(e) => form.setData('code', e.target.value)}
                                                    placeholder="i.e. C123"
                                                    className={form.errors.code ? 'border-red-500' : ''}
                                                />
                                                {form.errors.code && <p className="mt-1 text-xs text-red-500">{form.errors.code}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="name_inline">Name</Label>
                                                <Input
                                                    id="name_inline"
                                                    value={form.data.name}
                                                    onChange={(e) => form.setData('name', e.target.value)}
                                                    placeholder="i.e. John doe"
                                                    className={form.errors.name ? 'border-red-500' : ''}
                                                />
                                                {form.errors.name && <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="phone_inline">Phone</Label>
                                                <Input
                                                    id="phone_inline"
                                                    value={form.data.phone}
                                                    onChange={(e) => form.setData('phone', e.target.value)}
                                                    placeholder="i.e +997154752524"
                                                    className={form.errors.phone ? 'border-red-500' : ''}
                                                />
                                                {form.errors.phone && <p className="mt-1 text-xs text-red-500">{form.errors.phone}</p>}
                                            </div>
                                            <div className="flex items-end space-x-2">
                                                <Button type="submit" disabled={form.processing}>
                                                    {form.processing ? 'Creating...' : 'Create & Attach'}
                                                </Button>
                                                {form.isDirty && (
                                                    <Button type="button" variant="outline" onClick={() => form.reset()} disabled={form.processing}>
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </details>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="px-3 py-2">Code #</th>
                                        <th className="px-3 py-2">Name</th>
                                        <th className="px-3 py-2">Phone</th>
                                        <th className="px-3 py-2">Address</th>
                                        <th className="px-3 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.data.map((c: Pick<Customer, 'id' | 'code' | 'name' | 'phone' | 'address'>) => (
                                        <tr key={c.id} className="border-b last:border-0">
                                            <td className="px-3 py-2">{c.code}</td>
                                            <td className="px-3 py-2">{c.name}</td>
                                            <td className="px-3 py-2">{c.phone ?? '-'}</td>
                                            <td className="px-3 py-2">{c.address ?? '-'}</td>
                                            <td className="px-3 py-2">
                                                <Button variant="secondary" onClick={() => attachOrder(c.id)}>
                                                    Attach Order
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {customers.data.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-4 text-center" colSpan={4}>
                                                No customers yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4">
                            <Pagination links={customers.links} from={customers.from} to={customers.to} total={customers.total} />
                        </div>
                    </CardContent>
                </Card>

                {/* Orders table */}
                <Card>
                    <CardHeader className="flex flex-col gap-2">
                        <CardTitle>Orders</CardTitle>
                        <form onSubmit={searchOrders} className="flex gap-2">
                            <Input value={ordersSearch} onChange={(e) => setOrdersSearch(e.target.value)} placeholder="Search orders..." />
                            <Button type="submit">Search</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="px-3 py-2">Order #</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2">Total</th>
                                        <th className="px-3 py-2">Customer code</th>
                                        <th className="px-3 py-2">Total Products</th>
                                        <th className="px-3 py-2">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.map((o: Order) => (
                                        <tr key={o.id} className="border-b last:border-0">
                                            <td className="px-3 py-2">{o.order_number}</td>
                                            <td className="px-3 py-2 capitalize">{o.status}</td>
                                            <td className="px-3 py-2">{getFormatedAmount(o.total)}</td>
                                            <td className="px-3 py-2">{o.customer?.code ?? '-'}</td>
                                            <td className="px-3 py-2">{o.items_count}</td>
                                            <td className="px-3 py-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.visit(showOrders(o.id))}
                                                    className="hover:cursor-pointer"
                                                >
                                                    <TextSearch />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.data.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-4 text-center" colSpan={4}>
                                                No orders yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4">
                            <Pagination links={orders.links} from={orders.from} to={orders.to} total={orders.total} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
