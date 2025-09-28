import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ShipmentStatusIcons } from '@/lib/shipment-status-helper';
import { shipmentStatusOptions } from '@/lib/utils';
import { store } from '@/routes/shipments';
import { CreateShipmentProps, ShipmentRequest } from '@/types';
import { ShipmentStatus } from '@/types/enums';
import { useForm } from '@inertiajs/react';
import { Asterisk, Clock, Loader2 } from 'lucide-react';
import React from 'react';

export default function CreateShipment({ open, onOpenChange }: Readonly<CreateShipmentProps>) {
    const { data, setData, post, reset, clearErrors, errors, processing } = useForm<ShipmentRequest>({
        tracking_number: '',
        carrier: '',
        status: ShipmentStatus.PENDING,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(store().url, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
            onError: () => {
                console.log('CreateShipment - handleSubmit => Error ');
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
            <DialogContent className="max-h-[60vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="sticky top-0 border-b px-5 py-3">
                    <DialogTitle>Create Shipment</DialogTitle>
                    <DialogDescription>
                        Fill in the shipment details.
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 px-5 md:grid-cols-2">
                        <div>
                            <Label htmlFor="create-tracking_number">Tracking Number</Label>
                            <Input
                                id="create-tracking_number"
                                type="text"
                                value={data.tracking_number}
                                onChange={(e) => setData('tracking_number', e.target.value)}
                                placeholder="Enter tracking number"
                                className={errors.tracking_number ? 'border-red-500' : ''}
                            />
                            {errors.tracking_number && <div className="mt-1 text-sm text-red-600">{errors.tracking_number}</div>}
                        </div>

                        <div>
                            <Label htmlFor="create-carrier">Carrier</Label>
                            <Input
                                id="create-carrier"
                                type="text"
                                value={data.carrier}
                                onChange={(e) => setData('carrier', e.target.value)}
                                placeholder="FedEx, UPS, USPS, etc."
                                className={errors.carrier ? 'border-red-500' : ''}
                            />
                            {errors.carrier && <div className="mt-1 text-sm text-red-600">{errors.carrier}</div>}
                        </div>
                    </div>

                    <div className="px-5">
                        <Label htmlFor="create-status">Status</Label>
                        <Select value={data.status} onValueChange={(value) => setData('status', value as ShipmentStatus)}>
                            <SelectTrigger id="create-status" className={errors.status ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {shipmentStatusOptions.map(({ value, label }) => {
                                    const Icon = ShipmentStatusIcons[value] || Clock;
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
                        {errors.status && <div className="mt-1 text-sm text-red-600">{errors.status}</div>}
                    </div>

                    <div className="px-5">
                        <Label htmlFor="create-notes">Notes</Label>
                        <Textarea
                            id="create-notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                            placeholder="Additional information about this shipment"
                        />
                        {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
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
