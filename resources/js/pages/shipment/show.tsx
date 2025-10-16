import { DeleteItem, ExportData, Pagination } from '@/components/shared';
import MyTooltip from '@/components/shared/my-tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionsEnum, ResourcesEnum } from '@/enums';
import { usePermission } from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import { OrderStatusBadge } from '@/lib/order-status-helper';
import { ShipmentStatusBadge } from '@/lib/shipment-status-helper';
import { getFormattedAmount } from '@/lib/utils';
import EditShipment from '@/pages/shipment/EditShipment';
import { dashboard } from '@/routes';
import { destroy as destroyOrder, show as showOrder } from '@/routes/orders';
import { exportData, index, show } from '@/routes/shipments';
import {
    AttachCustomerSectionProps,
    BreadcrumbItem,
    CustomersTableProps,
    Order,
    OrdersTableProps,
    SelectOption,
    ShipmentInfoCardProps,
    ShowShipmentProps,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, TextSearch, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CreateCustomer from '../customer/CreateCustomer';
import CreateOrder from '../order/CreateOrder';

export default function ShipmentShowPage() {
    const { shipment, orders, customers, allCustomers, products, shipments, suppliers, flash } = usePage<ShowShipmentProps>().props;

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

    const customerOptions: SelectOption[] = allCustomers.map((c) => ({
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

    //##############//#####################//#############
    //##############// Handle Permissions //#############
    //#############//####################//#############
    const { hasPermission } = usePermission();
    const canAddCustomer = hasPermission(ActionsEnum.CREATE, ResourcesEnum.CUSTOMERS);
    const canAddOrder = hasPermission(ActionsEnum.CREATE, ResourcesEnum.ORDERS);
    const canDeleteOrder = hasPermission(ActionsEnum.DELETE, ResourcesEnum.ORDERS);
    const canViewOrder = hasPermission(ActionsEnum.VIEW, ResourcesEnum.ORDERS);
    const canEditShipments = hasPermission(ActionsEnum.EDIT, ResourcesEnum.SHIPMENTS);
    const canExportShipments = hasPermission(ActionsEnum.EXPORT, ResourcesEnum.SHIPMENTS);

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title={`Shipment #${shipment.id}`} />

            <div className="container mt-5 space-y-6 px-5 pb-5">
                {/* Shipment info card */}
                <ShipmentInfoCard
                    shipment={shipment}
                    canEditShipments={canEditShipments}
                    canExportShipments={canExportShipments}
                    onEditClick={() => setShowEditShipmentDialog(true)}
                />

                {/* Attach customer section */}
                <AttachCustomerSection
                    canAddOrder={canAddOrder}
                    canAddCustomer={canAddCustomer}
                    customerOptions={customerOptions}
                    selectedCustomerId={selectedCustomerIdToAttachOrder}
                    onCustomerSelect={setSelectedCustomerIdToAttachOrder}
                    onOpenCreateOrder={openCreateOrderDialog}
                    onOpenCreateCustomer={() => setShowCreateCustomerDialog(true)}
                />

                {/* Customers table */}
                <CustomersTable customers={customers} canAddOrder={canAddOrder} onCreateOrder={openCreateOrderDialog} />

                <OrdersTable
                    orders={orders}
                    canViewOrder={canViewOrder}
                    canDeleteOrder={canDeleteOrder}
                    onViewOrder={(orderId) => router.visit(showOrder(orderId))}
                    onDeleteOrder={openDeleteOrderDialog}
                />
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
                setSelectedCustomerId={setSelectedCustomerIdToAttachOrder}
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

// Start Shipment info card
const ShipmentInfoCard = ({ shipment, canEditShipments, canExportShipments, onEditClick }: ShipmentInfoCardProps) => {
    return (
        <Card className="p-0 py-3">
            <CardHeader className="flex items-center justify-between gap-x-2 border-b-1 border-b-gray-100 pb-1">
                <CardTitle>Shipment Info</CardTitle>
                {(canEditShipments || canExportShipments) && (
                    <div className="flex items-center gap-2">
                        {canEditShipments && (
                            <MyTooltip title="Edit shipment">
                                <Button variant="outline" size="icon" className="hover:cursor-pointer" onClick={onEditClick}>
                                    <Pencil className="mt-1 h-4 w-4" />
                                </Button>
                            </MyTooltip>
                        )}
                        {canExportShipments && (
                            <ExportData
                                btnSize={'icon'}
                                onExport={(type) => {
                                    const q = { type };
                                    window.location.href = exportData.url({ shipment: shipment.id }, { query: q });
                                }}
                            />
                        )}
                    </div>
                )}
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
                        <div className="mt-2 text-sm font-medium">{getFormattedAmount(shipment.total)}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
// End Shipment info card

// Start Attach customer section
const AttachCustomerSection = ({
    canAddOrder,
    canAddCustomer,
    customerOptions,
    selectedCustomerId,
    onCustomerSelect,
    onOpenCreateOrder,
    onOpenCreateCustomer,
}: AttachCustomerSectionProps) => {
    if (!canAddOrder && !canAddCustomer) return null;

    return (
        <div className="mb-6">
            <details className="rounded-lg border p-4">
                <summary className="cursor-pointer font-medium hover:text-primary">Attach Customer</summary>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="w-full space-y-2 md:col-span-2">
                        <Label className="text-sm font-medium" htmlFor="customer-select">
                            Select Customer
                        </Label>
                        <SearchableSelect
                            options={customerOptions}
                            value={selectedCustomerId}
                            onValueChange={onCustomerSelect}
                            placeholder="Search and select customer..."
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-end md:col-span-1">
                        <Button
                            type="button"
                            className="w-full sm:w-auto"
                            disabled={!selectedCustomerId}
                            onClick={() => onOpenCreateOrder(selectedCustomerId)}
                        >
                            Attach Order
                        </Button>
                        {selectedCustomerId ? (
                            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => onCustomerSelect('')}>
                                Cancel
                            </Button>
                        ) : canAddCustomer ? (
                            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onOpenCreateCustomer}>
                                No customer found
                            </Button>
                        ) : null}
                    </div>
                </div>
            </details>
        </div>
    );
};
// End Attach customer section

// Start Customers table
const CustomersTable = ({ customers, canAddOrder, onCreateOrder }: CustomersTableProps) => {
    return (
        <Card>
            <CardHeader className="border-b-1 border-b-gray-100">
                <CardTitle>Customers</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code #</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Address</TableHead>
                                {canAddOrder && <TableHead className="w-[150px]">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.data.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.code}</TableCell>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.phone ?? '-'}</TableCell>
                                        <TableCell>{customer.address ?? '-'}</TableCell>
                                        {canAddOrder && (
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onCreateOrder(customer.id.toString())}
                                                    className="w-full sm:w-auto"
                                                >
                                                    Attach Order
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4">
                    <Pagination links={customers.links} from={customers.from} to={customers.to} total={customers.total} />
                </div>
            </CardContent>
        </Card>
    );
};
// End Customers table

// Start Orders table
const OrdersTable = ({ orders, canViewOrder, canDeleteOrder, onViewOrder, onDeleteOrder }: OrdersTableProps) => {
    return (
        <Card>
            <CardHeader className="border-b-1 border-b-gray-100">
                <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Customer Code</TableHead>
                                <TableHead>Total Products</TableHead>
                                {(canViewOrder || canDeleteOrder) && <TableHead className="w-[100px]">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.data.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.order_number}</TableCell>
                                        <TableCell>{order.status ? <OrderStatusBadge status={order.status} /> : '-'}</TableCell>
                                        <TableCell>{getFormattedAmount(order.total)}</TableCell>
                                        <TableCell>{order.customer?.code ?? '-'}</TableCell>
                                        <TableCell>{order.items_count}</TableCell>
                                        {(canViewOrder || canDeleteOrder) && (
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {canViewOrder && (
                                                        <MyTooltip title="View details">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="hover:cursor-pointer"
                                                                onClick={() => onViewOrder(order.id)}
                                                            >
                                                                <TextSearch className="h-4 w-4" />
                                                            </Button>
                                                        </MyTooltip>
                                                    )}
                                                    {canDeleteOrder && (
                                                        <MyTooltip title="Delete order">
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                className="hover:cursor-pointer"
                                                                onClick={() => onDeleteOrder(order)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </MyTooltip>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4">
                    <Pagination links={orders.links} from={orders.from} to={orders.to} total={orders.total} />
                </div>
            </CardContent>
        </Card>
    );
};
// End Orders table
