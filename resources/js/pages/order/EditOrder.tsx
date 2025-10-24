import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatusEnum } from '@/enums';
import { OrderStatusIcons } from '@/lib/order-status-helper';
import { getCustomerOptions, getShipmentOptions, getSupplierOptions, orderStatusOptions } from '@/lib/utils';
import { update } from '@/routes/orders';
import { EditOrderProps, OrderRequest, SelectOption } from '@/types';
import { useForm } from '@inertiajs/react';
import { Asterisk, Clock, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

export default function EditOrder({ open, onOpenChange, order, customers, shipments, suppliers }: Readonly<EditOrderProps>) {
    const { data, setData, put, reset, clearErrors, processing, errors } = useForm<OrderRequest>({
        order_number: '',
        status: OrderStatusEnum.DRAFT,
        total: 0,
        customer_id: '',
        shipment_id: '',
        supplier_id: '',
    });
    const prevOrderId = useRef<number | null>(null);

    useEffect(() => {
        if (open && order && order.id !== prevOrderId.current) {
            setData({
                order_number: order.order_number,
                status: order.status,
                total: order.total,
                customer_id: order.customer.id.toString(),
                shipment_id: order.shipment?.id?.toString() ?? '',
                supplier_id: order.supplier?.id?.toString() ?? '',
            });
            prevOrderId.current = order.id;
        }
        if (!open) {
            reset();
            clearErrors();
            prevOrderId.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, order]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (order) {
            // auto compute total from items
            put(update.url(order.id), {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (error) => {
                    console.log('EditOrder - handleSubmit => Error ', error);
                },
            });
        }
    };

    // Prepare options for SearchableSelect
    const shipmentOptions: SelectOption[] = [{ value: '', label: 'No shipment' }, ...getShipmentOptions(shipments)];
    const supplierOptions: SelectOption[] = [{ value: '', label: 'No supplier' }, ...getSupplierOptions(suppliers)];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[95vh] w-full overflow-hidden p-0 sm:max-w-3xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Edit Order</DialogTitle>
                    <DialogDescription>
                        Update the supplier details.{' '}
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2 grid grid-cols-1 gap-4 px-5 md:grid-cols-2">
                        <div>
                            <Label htmlFor="edit-order_number">
                                Order Number <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-order_number"
                                type="text"
                                value={data.order_number}
                                onChange={(e) => setData('order_number', e.target.value)}
                                placeholder="e.g., ORD-2025-001"
                                required
                            />
                            {errors.order_number && <div className="mt-1 text-sm text-red-600">{errors.order_number}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value as OrderStatusEnum)}>
                                <SelectTrigger id="edit-status" className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {orderStatusOptions.map(({ value, label }) => {
                                        const Icon = OrderStatusIcons[value] || Clock;
                                        return (
                                            <SelectItem key={value} value={value}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    <span>{label}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="edit-customer_id">
                                Customer <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <SearchableSelect
                                options={getCustomerOptions(customers)}
                                value={data.customer_id}
                                onValueChange={(value) => setData('customer_id', value)}
                                placeholder="Select a customer"
                                emptyText="No customers found."
                                className={errors.customer_id ? 'border-red-500' : ''}
                            />
                            {errors.customer_id && <div className="mt-1 text-sm text-red-600">{errors.customer_id}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-shipment_id">Shipment</Label>
                            <SearchableSelect
                                options={shipmentOptions}
                                value={data.shipment_id}
                                onValueChange={(value) => setData('shipment_id', value)}
                                placeholder="Select shipment (optional)"
                                emptyText="No shipment found."
                                className={errors.shipment_id ? 'border-red-500' : ''}
                            />
                            {errors.shipment_id && <div className="mt-1 text-sm text-red-600">{errors.shipment_id}</div>}
                        </div>

                        <div className="sm:col-span-1 md:col-span-2">
                            <Label htmlFor="edit-supplier_id">Supplier</Label>
                            <SearchableSelect
                                options={supplierOptions}
                                value={data.supplier_id}
                                onValueChange={(value) => setData('supplier_id', value)}
                                placeholder="Select a supplier"
                                emptyText="No suppliers found."
                                className={errors.supplier_id ? 'border-red-500' : ''}
                            />
                            {errors.supplier_id && <div className="mt-1 text-sm text-red-600">{errors.supplier_id}</div>}
                        </div>
                    </div>

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-5 py-3">
                        <Button type="submit" disabled={processing} className={'ml-auto cursor-pointer px-6'}>
                            <span
                                className={
                                    processing ? 'absolute opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'
                                }
                            >
                                Update
                            </span>
                            <span
                                className={
                                    processing ? 'opacity-100 transition-opacity duration-300' : 'absolute opacity-0 transition-opacity duration-300'
                                }
                            >
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
