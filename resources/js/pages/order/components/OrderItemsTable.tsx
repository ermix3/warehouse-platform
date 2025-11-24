import { DeleteItem, Pagination } from '@/components/shared';
import MyTooltip from '@/components/shared/my-tooltip';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFormattedAmount } from '@/lib/utils';
import { detachProduct, updateOrderItem } from '@/routes/orders';
import { OrderItemLite, OrderItemsTableProps, OrderItemUpdate, OrderItemUpdateRequest } from '@/types';
import { router } from '@inertiajs/react';
import { groupBy } from 'lodash';
import { Asterisk, BookmarkX, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EditableCell } from './EditableCell';

type EditingState = {
    id: number | null;
    field: string;
    originalValue?: string | number;
};

export function OrderItemsTable({ order, orderItems, canEditOrder, selectedBoxCode, handleBoxCodeSelected }: Readonly<OrderItemsTableProps>) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteOrderItem, setDeleteOrderItem] = useState<OrderItemLite | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingItem, setEditingItem] = useState<EditingState>({ id: null, field: '' });
    const [editValue, setEditValue] = useState<string>('');

    // Group items by box_code
    const groupedItems = useMemo(() => {
        const groups = groupBy(orderItems.data, 'box_code');
        return Object.entries(groups).map(([boxCode, items]) => ({
            boxCode,
            items: [...items].sort((a, b) => a.id - b.id), // Sort items within each group
        }));
    }, [orderItems.data]);

    const orderIdentifier = useMemo(() => `${order.customer.code}-${order?.supplier?.code || 'SUPP'}-${order.order_number}`, [order]);

    const handleDelete = useCallback(() => {
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
            preserveScroll: true,
        });
    }, [deleteOrderItem, order.id]);

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
        if (editingItem.id) {
            const inputRef = document.querySelector(`input[name="${editingItem.field}"]`);
            if (inputRef) {
                (inputRef as HTMLInputElement).focus();
            }
        }
    }, [editingItem]);

    const handleStartEdit = useCallback((id: number, field: string, value: string | number) => {
        setEditingItem({ id, field, originalValue: value });
        setEditValue(String(value));
    }, []);

    const handleSaveEdit = useCallback(
        (id: number) => {
            // Don't save if value hasn't changed or is invalid
            if (editingItem.originalValue == editValue || !editValue.trim()) {
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
                    router.patch(updateOrderItem.url({ order: order.id, orderItem: id }), data, { preserveScroll: true });
                    setEditingItem({ id: null, field: '' });
                }
            } catch (error) {
                console.error('Failed to update order item:', error);
            }
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [editingItem, editValue],
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent, id: number) => {
            if (e.key === 'Enter') {
                handleSaveEdit(id);
            } else if (e.key === 'Escape') {
                setEditingItem({ id: null, field: '' });
            }
        },
        [handleSaveEdit],
    );

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
                            <TableCell colSpan={canEditOrder ? 8 : 7} className="h-24 text-center text-muted-foreground">
                                No order items found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        groupedItems.flatMap(({ boxCode, items }) => [
                            // Box Code Header Row
                            <TableRow
                                key={`box-${boxCode || 'none'}`}
                                className="cursor-pointer bg-muted/10 hover:bg-muted/20"
                                onClick={() => {
                                    // console.log("Box code clicked:", boxCode);
                                    handleBoxCodeSelected?.(boxCode || null);
                                }}
                            >
                                <MyTooltip title="You can select this Box Code to attach product">
                                    <TableCell
                                        colSpan={canEditOrder ? 8 : 7}
                                        className={`${selectedBoxCode === boxCode ? 'bg-green-50 text-green-700' : ''}`}
                                    >
                                        <div className="flex items-center justify-between gap-2 font-medium">
                                            <span
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    handleBoxCodeSelected(boxCode || null);
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold">Box Code</span>
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 font-mono">
                                                        {boxCode || 'No Box Code'}
                                                    </span>
                                                </div>
                                            </span>
                                            {selectedBoxCode === boxCode && (
                                                <span
                                                    className="cursor-pointer items-center rounded-md p-1 text-red-500 hover:bg-red-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleBoxCodeSelected(null);
                                                    }}
                                                >
                                                    <span className="sr-only">Deselect</span>
                                                    <BookmarkX className="h-4 w-4" />
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                </MyTooltip>
                            </TableRow>,
                            // Items in this box
                            ...items.map(({ id, ctn, product, box_qtt, sum, unit_price }: OrderItemUpdate, index: number) => (
                                <TableRow key={id}>
                                    <TableCell className="text-muted-foreground">{`${orderIdentifier}-${index + 1}`}</TableCell>
                                    <TableCell>
                                        {product.barcode} - {product.name}
                                    </TableCell>

                                    {/* Box/QTY */}
                                    <TableCell className="w-24">
                                        <EditableCell
                                            value={editingItem.id === id && editingItem.field === 'box_qtt' ? editValue : box_qtt}
                                            isEditing={editingItem.id === id && editingItem.field === 'box_qtt'}
                                            onStartEdit={() => handleStartEdit(id, 'box_qtt', box_qtt)}
                                            onSave={() => handleSaveEdit(id)}
                                            onChange={setEditValue}
                                            onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, id)}
                                        />
                                    </TableCell>

                                    {/* CTN */}
                                    <TableCell className="w-24">
                                        <EditableCell
                                            value={editingItem.id === id && editingItem.field === 'ctn' ? editValue : ctn}
                                            isEditing={editingItem.id === id && editingItem.field === 'ctn'}
                                            onStartEdit={() => handleStartEdit(id, 'ctn', ctn)}
                                            onSave={() => handleSaveEdit(id)}
                                            onChange={setEditValue}
                                            onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, id)}
                                        />
                                    </TableCell>

                                    {/* Sum */}
                                    <TableCell className="w-24">
                                        <EditableCell
                                            value={editingItem.id === id && editingItem.field === 'sum' ? editValue : sum}
                                            isEditing={editingItem.id === id && editingItem.field === 'sum'}
                                            onStartEdit={() => handleStartEdit(id, 'sum', sum)}
                                            onSave={() => handleSaveEdit(id)}
                                            onChange={setEditValue}
                                            onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, id)}
                                            step={0.01}
                                        />
                                    </TableCell>

                                    {/* Unit Price */}
                                    <TableCell className="w-32">
                                        <EditableCell
                                            value={
                                                editingItem.id === id && editingItem.field === 'unit_price'
                                                    ? editValue
                                                    : getFormattedAmount(unit_price)
                                            }
                                            isEditing={editingItem.id === id && editingItem.field === 'unit_price'}
                                            onStartEdit={() => handleStartEdit(id, 'unit_price', unit_price)}
                                            onSave={() => handleSaveEdit(id)}
                                            onChange={setEditValue}
                                            onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, id)}
                                            step={0.01}
                                        />
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
                            )),
                        ])
                    )}
                </TableBody>

                <TableFooter>
                    <TableRow className="bg-muted/10">
                        <TableCell colSpan={canEditOrder ? 8 : 7} className="p-2">
                            <Pagination links={orderItems.links} from={orderItems.from} to={orderItems.to} total={orderItems.total} />
                        </TableCell>
                    </TableRow>
                </TableFooter>
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
