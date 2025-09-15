import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/products';
import { EditProductProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function EditProduct({ open, onOpenChange, product, suppliers }: Readonly<EditProductProps>) {
    const form = useForm({
        barcode: '',
        name: '',
        description: '',
        origin: '',
        hs_code: '',
        unit_price: '',
        box_qtt: '',
        height: '',
        length: '',
        width: '',
        net_weight: '',
        box_weight: '',
        supplier_id: '',
    });
    const prevProductId = useRef<number | null>(null);

    useEffect(() => {
        if (open && product && product.id !== prevProductId.current) {
            form.setData({
                barcode: product.barcode,
                name: product.name,
                description: product.description ?? '',
                origin: product.origin,
                hs_code: product.hs_code,
                unit_price: product.unit_price.toString(),
                box_qtt: product.box_qtt.toString(),
                height: product.height.toString(),
                length: product.length.toString(),
                width: product.width.toString(),
                net_weight: product.net_weight.toString(),
                box_weight: product.box_weight.toString(),
                supplier_id: product.supplier_id?.toString() ?? '',
            });
            prevProductId.current = product.id;
        }
        if (!open) {
            form.reset();
            form.clearErrors();
            prevProductId.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, product]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (product) {
            form.put(update.url(product.id), {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    const supplierOptions = [
        { value: '', label: 'No supplier' },
        ...suppliers.map((supplier) => ({
            value: supplier.id.toString(),
            label: supplier.name,
        })),
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="edit-barcode">Barcode *</Label>
                            <Input
                                id="edit-barcode"
                                type="text"
                                value={form.data.barcode}
                                onChange={(e) => form.setData('barcode', e.target.value)}
                            />
                            {form.errors.barcode && <div className="mt-1 text-sm text-red-600">{form.errors.barcode}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-name">Name *</Label>
                            <Input id="edit-name" type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                            {form.errors.name && <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-origin">Origin *</Label>
                            <Input id="edit-origin" type="text" value={form.data.origin} onChange={(e) => form.setData('origin', e.target.value)} />
                            {form.errors.origin && <div className="mt-1 text-sm text-red-600">{form.errors.origin}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-hs_code">HS Code *</Label>
                            <Input
                                id="edit-hs_code"
                                type="text"
                                value={form.data.hs_code}
                                onChange={(e) => form.setData('hs_code', e.target.value)}
                            />
                            {form.errors.hs_code && <div className="mt-1 text-sm text-red-600">{form.errors.hs_code}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-unit_price">Unit Price *</Label>
                            <Input
                                id="edit-unit_price"
                                type="number"
                                step="0.01"
                                value={form.data.unit_price}
                                onChange={(e) => form.setData('unit_price', e.target.value)}
                            />
                            {form.errors.unit_price && <div className="mt-1 text-sm text-red-600">{form.errors.unit_price}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-box_qtt">Box Quantity *</Label>
                            <Input
                                id="edit-box_qtt"
                                type="number"
                                value={form.data.box_qtt}
                                onChange={(e) => form.setData('box_qtt', e.target.value)}
                            />
                            {form.errors.box_qtt && <div className="mt-1 text-sm text-red-600">{form.errors.box_qtt}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-height">Height (cm) *</Label>
                            <Input
                                id="edit-height"
                                type="number"
                                step="0.01"
                                value={form.data.height}
                                onChange={(e) => form.setData('height', e.target.value)}
                            />
                            {form.errors.height && <div className="mt-1 text-sm text-red-600">{form.errors.height}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-length">Length (cm) *</Label>
                            <Input
                                id="edit-length"
                                type="number"
                                step="0.01"
                                value={form.data.length}
                                onChange={(e) => form.setData('length', e.target.value)}
                            />
                            {form.errors.length && <div className="mt-1 text-sm text-red-600">{form.errors.length}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-width">Width (cm) *</Label>
                            <Input
                                id="edit-width"
                                type="number"
                                step="0.01"
                                value={form.data.width}
                                onChange={(e) => form.setData('width', e.target.value)}
                            />
                            {form.errors.width && <div className="mt-1 text-sm text-red-600">{form.errors.width}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-net_weight">Net Weight (kg) *</Label>
                            <Input
                                id="edit-net_weight"
                                type="number"
                                step="0.01"
                                value={form.data.net_weight}
                                onChange={(e) => form.setData('net_weight', e.target.value)}
                            />
                            {form.errors.net_weight && <div className="mt-1 text-sm text-red-600">{form.errors.net_weight}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-box_weight">Box Weight (kg) *</Label>
                            <Input
                                id="edit-box_weight"
                                type="number"
                                step="0.01"
                                value={form.data.box_weight}
                                onChange={(e) => form.setData('box_weight', e.target.value)}
                            />
                            {form.errors.box_weight && <div className="mt-1 text-sm text-red-600">{form.errors.box_weight}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-supplier_id">Supplier</Label>
                            <SearchableSelect
                                options={supplierOptions}
                                value={form.data.supplier_id}
                                onValueChange={(value) => form.setData('supplier_id', value)}
                                placeholder="Select a supplier (optional)"
                                emptyText="No suppliers found."
                                className={form.errors.supplier_id ? 'border-red-500' : ''}
                            />
                            {form.errors.supplier_id && <div className="mt-1 text-sm text-red-600">{form.errors.supplier_id}</div>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                            rows={3}
                        />
                        {form.errors.description && <div className="mt-1 text-sm text-red-600">{form.errors.description}</div>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
