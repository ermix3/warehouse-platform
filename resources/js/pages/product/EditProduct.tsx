import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/products';
import { EditProductProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { Asterisk } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function EditProduct({ open, onOpenChange, product }: Readonly<EditProductProps>) {
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

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset();
            form.clearErrors();
            prevProductId.current = null;
        }
        onOpenChange(isOpen);
    };

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

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[85vh] w-full overflow-hidden p-0 sm:max-w-2xl md:max-w-3xl">
                <DialogHeader className="sticky top-0 z-10 border-b px-6 py-3">
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>Update the product details. Fields marked with a red asterisk are required.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="max-h-[calc(85vh-9rem)] space-y-3 overflow-y-auto px-6 py-0">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                            <Label htmlFor="edit-barcode">
                                Barcode <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-barcode"
                                type="text"
                                placeholder="e.g., 1234567890123"
                                value={form.data.barcode}
                                onChange={(e) => form.setData('barcode', e.target.value)}
                            />
                            {form.errors.barcode && <div className="mt-1 text-sm text-red-600">{form.errors.barcode}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-name">
                                Name <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-name"
                                type="text"
                                placeholder="Product name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                            {form.errors.name && <div className="mt-1 text-sm text-red-600">{form.errors.name}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-origin">
                                Origin <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-origin"
                                type="text"
                                placeholder="Country of origin"
                                value={form.data.origin}
                                onChange={(e) => form.setData('origin', e.target.value)}
                            />
                            {form.errors.origin && <div className="mt-1 text-sm text-red-600">{form.errors.origin}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-hs_code">
                                HS Code <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-hs_code"
                                type="text"
                                placeholder="e.g., 9403.20"
                                value={form.data.hs_code}
                                onChange={(e) => form.setData('hs_code', e.target.value)}
                            />
                            {form.errors.hs_code && <div className="mt-1 text-sm text-red-600">{form.errors.hs_code}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-unit_price">
                                Unit Price <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-unit_price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={form.data.unit_price}
                                onChange={(e) => form.setData('unit_price', e.target.value)}
                            />
                            {form.errors.unit_price && <div className="mt-1 text-sm text-red-600">{form.errors.unit_price}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-box_qtt">
                                Box Quantity <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-box_qtt"
                                type="number"
                                min="0"
                                placeholder="Units per box"
                                value={form.data.box_qtt}
                                onChange={(e) => form.setData('box_qtt', e.target.value)}
                            />
                            {form.errors.box_qtt && <div className="mt-1 text-sm text-red-600">{form.errors.box_qtt}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-height">
                                Height (cm) <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-height"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={form.data.height}
                                onChange={(e) => form.setData('height', e.target.value)}
                            />
                            {form.errors.height && <div className="mt-1 text-sm text-red-600">{form.errors.height}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-length">
                                Length (cm) <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-length"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={form.data.length}
                                onChange={(e) => form.setData('length', e.target.value)}
                            />
                            {form.errors.length && <div className="mt-1 text-sm text-red-600">{form.errors.length}</div>}
                        </div>

                        <div className={'sm:col-span-2 md:col-span-1'}>
                            <Label htmlFor="edit-width">
                                Width (cm) <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-width"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={form.data.width}
                                onChange={(e) => form.setData('width', e.target.value)}
                            />
                            {form.errors.width && <div className="mt-1 text-sm text-red-600">{form.errors.width}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className={'md:col-span-2'}>
                            <Label htmlFor="edit-net_weight">
                                Net Weight (kg) <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-net_weight"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={form.data.net_weight}
                                onChange={(e) => form.setData('net_weight', e.target.value)}
                            />
                            {form.errors.net_weight && <div className="mt-1 text-sm text-red-600">{form.errors.net_weight}</div>}
                        </div>

                        <div className={'md:col-span-2'}>
                            <Label htmlFor="edit-box_weight">
                                Box Weight (kg) <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-box_weight"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={form.data.box_weight}
                                onChange={(e) => form.setData('box_weight', e.target.value)}
                            />
                            {form.errors.box_weight && <div className="mt-1 text-sm text-red-600">{form.errors.box_weight}</div>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Optional notes..."
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                            rows={3}
                        />
                        {form.errors.description && <div className="mt-1 text-sm text-red-600">{form.errors.description}</div>}
                    </div>

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-6 py-3">
                        <Button type="button" variant="outline" onClick={() => handleDialogChange(false)} disabled={form.processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
