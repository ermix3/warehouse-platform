import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/products';
import { CreateProductProps, ProductRequest } from '@/types';
import { useForm } from '@inertiajs/react';
import { Asterisk, Loader2 } from 'lucide-react';
import React from 'react';

export default function CreateProduct({ open, onOpenChange }: Readonly<CreateProductProps>) {
    const { post, setData, reset, clearErrors, data, errors, processing } = useForm<ProductRequest>({
        barcode: '',
        name: '',
        description: '',
        origin: '',
        hs_code: '',
        unit_price: 0,
        box_qtt: 0,
        height: 0,
        length: 0,
        width: 0,
        net_weight: 0,
        box_weight: 0,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(index().url, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
            onError: (error) => {
                console.log('CreateProduct - handleSubmit => Error ', error);
            },
        });
    };

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-h-[85vh] w-full overflow-hidden p-0 sm:max-w-2xl md:max-w-3xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Create Product</DialogTitle>
                    <DialogDescription>
                        Fill in the product details.
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="max-h-[calc(85vh-2rem)] space-y-3 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                            <Label htmlFor="create-barcode">
                                Barcode <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-barcode"
                                type="text"
                                placeholder="e.g., 1234567890123"
                                value={data.barcode}
                                onChange={(e) => setData('barcode', e.target.value)}
                                required
                            />
                            {errors.barcode && <div className="mt-1 text-sm text-red-600">{errors.barcode}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-name">
                                Name <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-name"
                                type="text"
                                placeholder="Product name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-origin">
                                Origin <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-origin"
                                type="text"
                                placeholder="Country of origin"
                                value={data.origin}
                                onChange={(e) => setData('origin', e.target.value)}
                                required
                            />
                            {errors.origin && <div className="mt-1 text-sm text-red-600">{errors.origin}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-hs_code">
                                HS Code <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-hs_code"
                                type="text"
                                placeholder="e.g., 9403.20"
                                value={data.hs_code}
                                onChange={(e) => setData('hs_code', e.target.value)}
                                required
                            />
                            {errors.hs_code && <div className="mt-1 text-sm text-red-600">{errors.hs_code}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-unit_price">
                                Unit Price <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-unit_price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={data.unit_price}
                                onChange={(e) => setData('unit_price', +e.target.value)}
                                required
                            />
                            {errors.unit_price && <div className="mt-1 text-sm text-red-600">{errors.unit_price}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-box_qtt">
                                Box Quantity <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-box_qtt"
                                type="number"
                                step="1"
                                min="0"
                                value={data.box_qtt}
                                onChange={(e) => setData('box_qtt', +e.target.value)}
                                required
                            />
                            {errors.box_qtt && <div className="mt-1 text-sm text-red-600">{errors.box_qtt}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-height">
                                Height (cm) <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-height"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.height}
                                onChange={(e) => setData('height', +e.target.value)}
                                required
                            />
                            {errors.height && <div className="mt-1 text-sm text-red-600">{errors.height}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-length">
                                Length (cm) <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-length"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.length}
                                onChange={(e) => setData('length', +e.target.value)}
                                required
                            />
                            {errors.length && <div className="mt-1 text-sm text-red-600">{errors.length}</div>}
                        </div>

                        <div className={'sm:col-span-2 md:col-span-1'}>
                            <Label htmlFor="create-width">
                                Width (cm) <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-width"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.width}
                                onChange={(e) => setData('width', +e.target.value)}
                                required
                            />
                            {errors.width && <div className="mt-1 text-sm text-red-600">{errors.width}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 px-5 md:grid-cols-4">
                        <div className={'md:col-span-2'}>
                            <Label htmlFor="create-net_weight">
                                Net Weight (kg) <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-net_weight"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.net_weight}
                                onChange={(e) => setData('net_weight', +e.target.value)}
                                required
                            />
                            {errors.net_weight && <div className="mt-1 text-sm text-red-600">{errors.net_weight}</div>}
                        </div>

                        <div className={'md:col-span-2'}>
                            <Label htmlFor="create-box_weight">
                                Box Weight (kg) <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-box_weight"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.box_weight}
                                onChange={(e) => setData('box_weight', +e.target.value)}
                                required
                            />
                            {errors.box_weight && <div className="mt-1 text-sm text-red-600">{errors.box_weight}</div>}
                        </div>
                    </div>

                    <div className="px-5">
                        <Label htmlFor="create-description">Description</Label>
                        <Textarea
                            id="create-description"
                            placeholder="Optional notes..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                        />
                        {errors.description && <div className="mt-1 text-sm text-red-600">{errors.description}</div>}
                    </div>

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-5 py-3">
                        <Button type="button" variant="outline" onClick={() => handleDialogChange(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className={'px-6'}>
                            <span
                                className={
                                    processing ? 'absolute opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'
                                }
                            >
                                Create
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
