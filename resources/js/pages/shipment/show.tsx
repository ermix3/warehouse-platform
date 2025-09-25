import { DeleteItem, ExportData, Pagination } from '@/components/shared';
import MyTooltip from '@/components/shared/my-tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import AppLayout from '@/layouts/app-layout';
import { ShipmentStatusBadge } from '@/lib/shipment-status-helper';
import { getFormatedAmount } from '@/lib/utils';
import EditShipment from '@/pages/shipment/EditShipment';
import { dashboard } from '@/routes';
import { destroy as destroyOrder, show as showOrder } from '@/routes/orders';
import { exportData, index, show } from '@/routes/shipments';
import { BreadcrumbItem, Customer, Order, ShowShipmentProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, TextSearch, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CreateCustomer from '../customer/CreateCustomer';
import CreateOrder from '../order/CreateOrder';

export default function ShipmentShowPage() {
    const { shipment, orders, customers, allCustomers, products, shipments, suppliers, filters, flash, enums } = usePage<ShowShipmentProps>().props;

    const [ordersSearch, setOrdersSearch] = useState(filters.orders_search ?? '');
    const [customersSearch, setCustomersSearch] = useState(filters.customers_search ?? '');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [selectedCustomerIdToAttachOrder, setSelectedCustomerIdToAttachOrder] = useState<string>('');
    const [showCreateCustomerDialog, setShowCreateCustomerDialog] = useState(false);
    const [showCreateOrderDialog, setShowCreateOrderDialog] = useState(false);
    const [showEditShipmentDialog, setShowEditShipmentDialog] = useState(false);
    // for delete order
    const [showDeleteOrderDialog, setShowDeleteOrderDialog] = useState(false);
    const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateOrderDialog = (customerId: string) => {
        setShowCreateOrderDialog(true);
        setSelectedCustomerId(customerId);
    };

    const searchOrders = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(show.url(shipment.id), { ...filters, orders_search: ordersSearch }, { preserveScroll: true });
    };

    const searchCustomers = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(show.url(shipment.id), { ...filters, customers_search: customersSearch }, { preserveScroll: true });
    };

    const customerOptions = allCustomers.map((c) => ({
        value: c.id.toString(),
        label: `${c.code} - ${c.name}`,
    }));

    const openDeleteOrderDialog = (order: Order) => {
        setDeleteOrder(order);
        setShowDeleteOrderDialog(true);
    };

    const closeDeleteOrderDialog = () => {
        if (!isDeleting) {
            setShowDeleteOrderDialog(false);
            setDeleteOrder(null);
        }
    };

    const handleDeleteOrder = () => {
        if (!deleteOrder) return;

        setIsDeleting(true);
        router.delete(destroyOrder.url({ order: deleteOrder.id }), {
            onSuccess: () => {
                setShowDeleteOrderDialog(false);
                setDeleteOrder(null);
            },
            onError: (error) => {
                console.error('Failed to delete shipment: ', error);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

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
                        <div className="flex items-center gap-2">
                            <MyTooltip title="Edit shipment">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="hover:cursor-pointer"
                                    onClick={() => setShowEditShipmentDialog(true)}
                                >
                                    <Pencil className="mt-1 h-4 w-4" />
                                </Button>
                            </MyTooltip>
                            <ExportData
                                btnSize={'icon'}
                                onExport={(type) => {
                                    const q = { type };
                                    window.location.href = exportData.url({ shipment: shipment.id }, { query: q });
                                }}
                            />
                        </div>
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
                                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <div className="w-full md:col-span-2">
                                        <Label className="text-md inline-block w-full font-bold" htmlFor="customer-select">
                                            Select Customer
                                        </Label>
                                        <div className="mt-2">
                                            <SearchableSelect
                                                options={customerOptions}
                                                value={selectedCustomerIdToAttachOrder}
                                                onValueChange={(value) => setSelectedCustomerIdToAttachOrder(value)}
                                                placeholder="Search and select customer..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-end md:col-span-1">
                                        <Button
                                            type="button"
                                            className="w-full hover:cursor-pointer sm:w-auto"
                                            disabled={!selectedCustomerIdToAttachOrder}
                                            onClick={() => openCreateOrderDialog(selectedCustomerIdToAttachOrder)}
                                        >
                                            Attach Order
                                        </Button>
                                        {selectedCustomerIdToAttachOrder && (
                                            <Button
                                                type="button"
                                                className="w-full hover:cursor-pointer sm:w-auto"
                                                variant="outline"
                                                onClick={() => setSelectedCustomerIdToAttachOrder('')}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        {!selectedCustomerIdToAttachOrder && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full hover:cursor-pointer sm:w-auto"
                                                onClick={() => setShowCreateCustomerDialog(true)}
                                            >
                                                No customer found
                                            </Button>
                                        )}
                                    </div>
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
                                                <Button
                                                    variant="outline"
                                                    onClick={() => openCreateOrderDialog(c.id.toString())}
                                                    className="hover:cursor-pointer"
                                                >
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
                                        <th className="px-3 py-2">Actions</th>
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
                                            <td className="flex gap-2 px-3 py-2">
                                                <MyTooltip title="Details">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.visit(showOrder(o.id))}
                                                        className="hover:cursor-pointer"
                                                    >
                                                        <TextSearch />
                                                    </Button>
                                                </MyTooltip>
                                                <MyTooltip title="Delete">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => openDeleteOrderDialog(o)}
                                                        className="text-center hover:cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </MyTooltip>
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

            {/* Edit shipment */}
            <EditShipment open={showEditShipmentDialog} onOpenChange={setShowEditShipmentDialog} shipment={shipment} />

            {/* Add customer */}
            <CreateCustomer open={showCreateCustomerDialog} onOpenChange={setShowCreateCustomerDialog} />

            {/* Add order */}
            <CreateOrder
                open={showCreateOrderDialog}
                onOpenChange={setShowCreateOrderDialog}
                customers={allCustomers}
                suppliers={suppliers}
                shipments={shipments}
                customer_id={selectedCustomerId}
                shipment_id={shipment.id.toString()}
                products={products}
                enums={enums}
            />

            {/* Delete order */}
            <DeleteItem
                open={showDeleteOrderDialog}
                onOpenChange={closeDeleteOrderDialog}
                title="Delete Order"
                itemName={deleteOrder?.order_number || `#${deleteOrder?.id}`}
                description={
                    deleteOrder?.items_count
                        ? `This order has ${deleteOrder.items_count} associated items. Deleting it may affect these shipments.`
                        : 'This action cannot be undone.'
                }
                isDeleting={isDeleting}
                onDelete={handleDeleteOrder}
            />
        </AppLayout>
    );
}
