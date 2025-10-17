import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { attachProduct } from '@/routes/orders';
import { AttachProductSectionProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { Asterisk } from 'lucide-react';

export function AttachProductSection({ orderId, productOptions, onOpenCreateProduct, canAddProduct }: AttachProductSectionProps) {
    const { data, setData, post, processing, errors, reset, isDirty } = useForm({
        product_id: '',
        ctn: 1,
    });

    const handleAttach = (e: React.FormEvent) => {
        e.preventDefault();
        post(attachProduct.url(orderId), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };
    return (
        <div className="mb-6">
            <details className="rounded-lg border p-4">
                <summary className="cursor-pointer font-medium hover:text-primary">Attach Product</summary>
                <form onSubmit={handleAttach} className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-12">
                    <div className="md:col-span-8">
                        <Label htmlFor="product">
                            Product <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                        </Label>
                        <SearchableSelect
                            options={productOptions}
                            value={data.product_id}
                            onValueChange={(value) => setData('product_id', value)}
                            placeholder="Search and select product..."
                        />
                        {errors.product_id && <div className="mt-1 text-sm text-red-500">{errors.product_id}</div>}
                    </div>
                    <div className="md:col-span-1">
                        <Label htmlFor="ctn">
                            CTN
                            <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                        </Label>
                        <Input
                            id="ctn"
                            type="number"
                            min={1}
                            value={data.ctn}
                            onChange={(e) => setData('ctn', Number.parseInt(e.target.value) || 1)}
                        />
                        {errors.ctn && <div className="mt-1 text-sm text-red-500">{errors.ctn}</div>}
                    </div>
                    <div className="flex items-end space-x-2 md:col-span-3">
                        <Button type="submit" className="hover:cursor-pointer" disabled={processing || !isDirty}>
                            {processing ? 'Creating...' : 'Attach'}
                        </Button>
                        {isDirty ? (
                            <Button type="button" variant="outline" className="hover:cursor-pointer" onClick={() => reset()} disabled={processing}>
                                Cancel
                            </Button>
                        ) : canAddProduct ? (
                            <Button type="button" variant="outline" className="w-full hover:cursor-pointer sm:w-auto" onClick={onOpenCreateProduct}>
                                No product found
                            </Button>
                        ) : null}
                    </div>
                </form>
            </details>
        </div>
    );
}
