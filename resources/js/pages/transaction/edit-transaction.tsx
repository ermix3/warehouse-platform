import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TransactionTypeEnum } from '@/enums/transaction-type-enum';
import { getCustomerOptions } from '@/lib/utils';
import { update } from '@/routes/transactions';
import { EditTransactionProps, TransactionEditRequest } from '@/types/transaction';
import { useForm } from '@inertiajs/react';
import { Asterisk, Loader2 } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';

export default function EditTransaction({ open, onOpenChange, transaction, customers }: Readonly<EditTransactionProps>) {
    const { data, setData, errors, clearErrors, put, processing } = useForm<TransactionEditRequest>({
        type: '',
        value: 0,
        notes: '',
        customer_id: '',
        created_at: '',
    });

    const resetForm = useCallback(() => {
        if (transaction) {
            setData({
                type: transaction.type,
                value: transaction.value,
                notes: transaction.notes ?? '',
                customer_id: transaction.customer?.id?.toString() ?? '',
                created_at: transaction.created_at ? new Date(transaction.created_at).toISOString().slice(0, 16) : '',
            });
            clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction]);

    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open, resetForm]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!transaction) return;

        put(update.url(transaction.id), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
            onError: (error) => {
                console.log('EditTransaction - handleSubmit => Error ', error);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[72vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="border-b px-5 py-3">
                    <DialogTitle>Edit Transaction</DialogTitle>
                    <DialogDescription>
                        Update the transaction details.
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 px-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-customer">
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

                        <div className="space-y-2">
                            <Label htmlFor="edit-type">
                                Transaction Type <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Select value={data.type} onValueChange={(value) => setData('type', value)} required>
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
                            <Label htmlFor="edit-value">
                                Value <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-value"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.value}
                                onChange={(e) => setData('value', Number.parseFloat(e.target.value) || 0)}
                                placeholder="e.g. 100.00"
                                required
                            />
                            {errors.value && <div className="mt-1 text-sm text-red-600">{errors.value}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-created-at">
                                Created At <Asterisk color={'red'} size={12} className={'inline-flex align-super'} />
                            </Label>
                            <Input
                                id="edit-created-at"
                                type="datetime-local"
                                value={data.created_at}
                                onChange={(e) => setData('created_at', e.target.value)}
                                required
                            />
                            {errors.created_at && <div className="mt-1 text-sm text-red-600">{errors.created_at}</div>}
                        </div>
                    </div>

                    <div className="space-y-2 px-5">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea
                            id="edit-notes"
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
