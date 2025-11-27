import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionsEnum, ResourcesEnum } from '@/enums';
import { usePermission } from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import { getProductOptions } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index, show } from '@/routes/orders';
import { ShowOrderProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Asterisk, Info, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import CreateProduct from '../product/CreateProduct';
import { AttachProductSection } from './components/AttachProductSection';
import { InfoCustomerCard } from './components/InfoCustomerCard';
import { InfoOrderCard } from './components/InfoOrderCard';
import { InfoShipmentCard } from './components/InfoShipmentCard';
import { OrderItemsTable } from './components/OrderItemsTable';
import MyTooltip from '@/components/shared/my-tooltip';

export default function ShowOrder({ order, orderItems, products, customers, shipments, suppliers, flash }: Readonly<ShowOrderProps>) {
    const [showCreateProductDialog, setShowCreateProductDialog] = useState(false);
    const [selectedBoxCode, setSelectedBoxCode] = useState<string | null>(null);

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: dashboard.url(),
        },
        {
            title: 'Orders',
            href: index.url(),
        },
        {
            title: order.order_number,
            href: show.url(order.id),
        },
    ];

    //##############//#####################//#############
    //##############// Handle Permissions //#############
    //#############//####################//#############
    const { hasPermission } = usePermission();
    const canAddProduct = hasPermission(ActionsEnum.CREATE, ResourcesEnum.PRODUCTS);
    const canEditOrder = hasPermission(ActionsEnum.EDIT, ResourcesEnum.ORDERS);
    const canExportShipments = hasPermission(ActionsEnum.EXPORT, ResourcesEnum.SHIPMENTS);
    const canViewShipments = hasPermission(ActionsEnum.VIEW, ResourcesEnum.SHIPMENTS);

    return (
        <AppLayout flash={flash} breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.order_number}`} />

            <div className="container mt-5 space-y-6 px-5 pb-5">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <InfoOrderCard order={order} customers={customers} suppliers={suppliers} shipments={shipments} />
                    <InfoCustomerCard order={order} />
                    <InfoShipmentCard order={order} canExportShipments={canExportShipments} canViewShipments={canViewShipments} />
                </div>

                <AttachProductSection
                    orderId={order.id}
                    productOptions={getProductOptions(products)}
                    onOpenCreateProduct={() => setShowCreateProductDialog(true)}
                    canAddProduct={canAddProduct}
                    selectedBoxCode={selectedBoxCode}
                />

                <Card className="pt-3">
                    <CardHeader className="border-b-2 border-b-gray-100 py-0">
                        <div className="flex items-center justify-between">
                            <CardTitle>Order Items</CardTitle>
                            <MyTooltip title="You can attach a product to a specific box by selecting a box-code. If you don't select a box-code, the product will be attached to a new box." className={{ trigger: 'cursor-pointer', contentWrapper: 'bg-orange-700', subContent: 'font-semibold text-md' }} side="left">
                                        <Lightbulb className="h-6 w-6 text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300" strokeWidth={3} />
                            </MyTooltip>
                        </div>
                        <CardDescription className="mb-1 w-fit rounded-xl bg-orange-100/50 px-2 py-1 text-sm text-black dark:bg-orange-400/5 dark:text-foreground">
                            <Info size={18} className={'mr-2 mb-2 -ml-4 inline-flex text-orange-500 dark:text-orange-300'} />
                            Click on any value with <Asterisk size={12} className="inline-flex align-super text-blue-500 dark:text-blue-300" /> to
                            edit, when finished editing press{' '}
                            <b className="font-bold text-blue-500 underline decoration-wavy underline-offset-4 dark:text-blue-300">enter</b> to save
                            or <b className="font-bold text-blue-500 underline decoration-wavy underline-offset-4 dark:text-blue-300"> escape </b> to
                            cancel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrderItemsTable
                            order={order}
                            orderItems={orderItems}
                            canEditOrder={canEditOrder}
                            selectedBoxCode={selectedBoxCode}
                            handleBoxCodeSelected={setSelectedBoxCode}
                        />
                    </CardContent>
                </Card>
            </div>

            <CreateProduct open={showCreateProductDialog} onOpenChange={setShowCreateProductDialog} />
        </AppLayout>
    );
}
