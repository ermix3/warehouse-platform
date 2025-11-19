import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/transactions';
import { CreateTransactionProps, TransactionRequest } from '@/types/transaction';
import { TransactionTypeEnum } from '@/enums/transaction-type-enum';
import { useForm } from '@inertiajs/react';
import { Asterisk, Loader2 } from 'lucide-react';
import React, { useCallback } from 'react';

export default function CreateTransaction({ open, onOpenChange, customers }: Readonly<CreateTransactionProps>) {
    const { data, setData, errors, reset, clearErrors, post, processing } = useForm<TransactionRequest>({
        type: '',
        value: 0,
        notes: '',
        customer_id: '',
    });

    const resetForm = useCallback(() => {
        reset();
        clearErrors();
    }, [reset, clearErrors]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                resetForm();
            },
            onError: (error) => {
                console.log('CreateTransaction - handleSubmit => Error ', error);
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
            <DialogContent className="max-h-[72vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Create Transaction</DialogTitle>
                    <DialogDescription>
                        Fill in the transaction details.
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 px-5 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="create-customer">
                                Customer <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Select
                                value={data.customer_id}
                                onValueChange={(value) => setData('customer_id', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id.toString()}>
                                            {customer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.customer_id && <div className="mt-1 text-sm text-red-600">{errors.customer_id}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-type">
                                Transaction Type <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Select
                                value={data.type}
                                onValueChange={(value) => setData('type', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select transaction type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={TransactionTypeEnum.INCOME}>Income</SelectItem>
                                    <SelectItem value={TransactionTypeEnum.OUTCOME}>Outcome</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <div className="mt-1 text-sm text-red-600">{errors.type}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-value">
                                Value <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="create-value"
                                type="number"
                                step="0.01"
                                min="0"
                                inputMode="numeric"
                                value={data.value.toString()}
                                onChange={(e) => setData('value', parseFloat(e.target.value) || 0)}
                                placeholder="e.g. 100.00"
                                required
                            />
                            {errors.value && <div className="mt-1 text-sm text-red-600">{errors.value}</div>}
                        </div>
                    </div>

                    <div className="space-y-2 px-5">
                        <Label htmlFor="create-notes">Notes</Label>
                        <Textarea
                            id="create-notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="e.g. Payment for invoice #123, Refund for order #456"
                            rows={3}
                        />
                        {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                    </div>

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-5 py-3">
                        <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className={'cursor-pointer px-6'}>
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
