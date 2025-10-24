import { DeleteItem } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFormattedAmount } from '@/lib/utils';
import { detachProduct, updateOrderItem } from '@/routes/orders';
import { OrderItemLite, OrderItemsTableProps, OrderItemUpdate, OrderItemUpdateRequest } from '@/types';
import { router } from '@inertiajs/react';
import { Asterisk, Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export function OrderItemsTable({ order, orderItems, canEditOrder }: OrderItemsTableProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteOrderItem, setDeleteOrderItem] = useState<OrderItemLite | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingItem, setEditingItem] = useState<{ id: number | null; field: string; originalValue?: string }>({ id: null, field: '' });
    const [editValue, setEditValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDelete = () => {
        if (!deleteOrderItem) return;

        setIsDeleting(true);
        router.delete(detachProduct.url({ order: order.id, orderItem: deleteOrderItem.id }), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeleteOrderItem(null);
            },
            onError: (error) => {
                console.error('Failed to detach product: ', error);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const openDeleteDialog = (orderItem: OrderItemLite) => {
        setDeleteOrderItem(orderItem);
        setShowDeleteDialog(true);
    };

    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false);
            setDeleteOrderItem(null);
        }
    };

    // Focus the input when editing starts
    useEffect(() => {
        if (editingItem.id && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingItem]);

    const handleStartEdit = (item: OrderItemLite, field: string, value: string | number) => {
        setEditingItem({ id: item.id, field, originalValue: String(value) });
        setEditValue(String(value));
    };

    const handleSaveEdit = async (item: OrderItemLite) => {
        // Don't save if value hasn't changed or is invalid
        if (editingItem.originalValue === editValue || !editValue.trim()) {
            setEditingItem({ id: null, field: '' });
            return;
        }

        try {
            const data: OrderItemUpdateRequest = {};

            switch (editingItem.field) {
                case 'ctn':
                    data.ctn = Number.parseInt(editValue) || 1;
                    break;
                case 'box_qtt':
                    data.box_qtt = Number.parseInt(editValue) || 1;
                    break;
                case 'sum':
                    data.sum = Number.parseInt(editValue) || 0;
                    break;
                case 'unit_price':
                    data.unit_price = Number.parseFloat(editValue) || 0;
                    break;
            }

            if (Object.keys(data).length > 0) {
                await router.patch(updateOrderItem.url({ order: order.id, orderItem: item.id }), data, { preserveScroll: true });
                setEditingItem({ id: null, field: '' });
            }
        } catch (error) {
            console.error('Failed to update order item:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, item: OrderItemLite) => {
        if (e.key === 'Enter') {
            handleSaveEdit(item);
        } else if (e.key === 'Escape') {
            setEditingItem({ id: null, field: '' });
        }
    };

    return (
        <div className="relative rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID #</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>
                            Box/QTY <Asterisk size={12} className={'inline-flex align-super text-blue-500'} />
                        </TableHead>
                        <TableHead>
                            CTN <Asterisk size={12} className={'inline-flex align-super text-blue-500'} />
                        </TableHead>
                        <TableHead>
                            Sum <Asterisk size={12} className={'inline-flex align-super text-blue-500'} />
                        </TableHead>
                        <TableHead>
                            Unit Price <Asterisk size={12} className={'inline-flex align-super text-blue-500'} />
                        </TableHead>
                        <TableHead>Total</TableHead>
                        {canEditOrder && <TableHead>Action</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orderItems.data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={canEditOrder ? 9 : 8} className="h-24 text-center text-muted-foreground">
                                No order items found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orderItems.data
                            .toSorted((a, b) => a.id - b.id)
                            .map(({ id, ctn, product, box_qtt, sum, unit_price }: OrderItemUpdate, index: number) => (
                                <TableRow key={id}>
                                    <TableCell className="font-medium">
                                        {`${order.customer.code}-${order?.supplier?.code || 'SUPP'}-${order.order_number}-${index + 1}`}
                                    </TableCell>
                                    <TableCell>{product.barcode + ' - ' + product.name}</TableCell>

                                    {/* Box/QTY */}
                                    <TableCell className="w-24">
                                        {editingItem.id === id && editingItem.field === 'box_qtt' ? (
                                            <Input
                                                ref={inputRef}
                                                type="number"
                                                min="1"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => handleSaveEdit({ id, ctn, product })}
                                                onKeyDown={(e) => handleKeyDown(e, { id, ctn, product })}
                                                className="h-8 w-20"
                                            />
                                        ) : (
                                            <div
                                                className="group relative min-w-[60px] cursor-pointer rounded-md border border-transparent p-1.5 text-center transition-all hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-700 dark:hover:bg-blue-900/40"
                                                onClick={() => handleStartEdit({ id, ctn, product }, 'box_qtt', box_qtt)}
                                            >
                                                <span className="flex items-center justify-between">
                                                    <span className="flex-1 dark:text-foreground">{box_qtt || '-'}</span>
                                                    <span className="invisible ml-1 text-blue-500 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 dark:text-blue-300">
                                                        <Pencil className="h-4 w-4" />
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* CTN */}
                                    <TableCell className="w-24">
                                        {editingItem.id === id && editingItem.field === 'ctn' ? (
                                            <Input
                                                ref={inputRef}
                                                type="number"
                                                min="1"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => handleSaveEdit({ id, ctn, product })}
                                                onKeyDown={(e) => handleKeyDown(e, { id, ctn, product })}
                                                className="h-8 w-20"
                                            />
                                        ) : (
                                            <div
                                                className="group relative min-w-[60px] cursor-pointer rounded-md border border-transparent p-1.5 text-center transition-all hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-700 dark:hover:bg-blue-900/40"
                                                onClick={() => handleStartEdit({ id, ctn, product }, 'ctn', ctn)}
                                            >
                                                <span className="flex items-center justify-between">
                                                    <span className="flex-1 dark:text-foreground">{ctn}</span>
                                                    <span className="invisible ml-1 text-blue-500 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 dark:text-blue-300">
                                                        <Pencil className="h-4 w-4" />
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Sum */}
                                    <TableCell className="w-24">
                                        {editingItem.id === id && editingItem.field === 'sum' ? (
                                            <Input
                                                ref={inputRef}
                                                type="number"
                                                min="0"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => handleSaveEdit({ id, ctn, product })}
                                                onKeyDown={(e) => handleKeyDown(e, { id, ctn, product })}
                                                className="h-8 w-20"
                                            />
                                        ) : (
                                            <div
                                                className="group relative min-w-[60px] cursor-pointer rounded-md border border-transparent p-1.5 text-center transition-all hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-700 dark:hover:bg-blue-900/40"
                                                onClick={() => handleStartEdit({ id, ctn, product }, 'sum', sum)}
                                            >
                                                <span className="flex items-center justify-between">
                                                    <span className="flex-1 dark:text-foreground">{sum}</span>
                                                    <span className="invisible ml-1 text-blue-500 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 dark:text-blue-300">
                                                        <Pencil className="h-4 w-4" />
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Unit Price */}
                                    <TableCell className="w-32">
                                        {editingItem.id === id && editingItem.field === 'unit_price' ? (
                                            <Input
                                                ref={inputRef}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => handleSaveEdit({ id, ctn, product })}
                                                onKeyDown={(e) => handleKeyDown(e, { id, ctn, product })}
                                                className="h-8 w-28"
                                            />
                                        ) : (
                                            <div
                                                className="group relative min-w-[60px] cursor-pointer rounded-md border border-transparent p-1.5 text-center transition-all hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-700 dark:hover:bg-blue-900/40"
                                                onClick={() => handleStartEdit({ id, ctn, product }, 'unit_price', unit_price)}
                                            >
                                                <span className="flex items-center justify-between">
                                                    <span className="flex-1 dark:text-foreground">{getFormattedAmount(unit_price ?? 0)}</span>
                                                    <span className="invisible ml-1 text-blue-500 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 dark:text-blue-300">
                                                        <Pencil className="h-4 w-4" />
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Total */}
                                    <TableCell className="font-medium">{getFormattedAmount(unit_price * sum)}</TableCell>

                                    {/* Action */}
                                    {canEditOrder && (
                                        <TableCell className="w-16">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:cursor-pointer hover:bg-red-50 hover:text-red-600"
                                                onClick={() => openDeleteDialog({ id, ctn, product })}
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                    )}
                </TableBody>
            </Table>

            {/* Detach item from order */}
            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Remove Product"
                itemName={deleteOrderItem?.product?.name || 'this product'}
                description="Are you sure you want to remove this product from the order?"
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </div>
    );
}
