import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ShipmentStatusIcons } from '@/lib/shipment-status-helper';
import { shipmentStatusOptions } from '@/lib/utils';
import { update } from '@/routes/shipments';
import { EditShipmentProps, ShipmentRequest } from '@/types';
import { ShipmentStatus } from '@/types/enums';
import { useForm } from '@inertiajs/react';
import { Asterisk, CircleAlert, Clock, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

export default function EditShipment({ open, onOpenChange, shipment }: Readonly<EditShipmentProps>) {
    const { data, setData, put, reset, clearErrors, errors, processing } = useForm<ShipmentRequest>({
        tracking_number: '',
        carrier: '',
        status: ShipmentStatus.PENDING,
        notes: '',
    });

    const prevIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (open && shipment && shipment.id !== prevIdRef.current) {
            setData({
                tracking_number: shipment.tracking_number ?? '',
                carrier: shipment.carrier ?? '',
                status: shipment.status ?? ShipmentStatus.PENDING,
                notes: shipment.notes ?? '',
            });
            prevIdRef.current = shipment.id;
        }

        if (!open) {
            reset();
            clearErrors();
            prevIdRef.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, shipment]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!shipment) return;

        put(update(shipment.id).url, {
            onSuccess: () => {
                onOpenChange(false);
            },
            onError: (error) => {
                console.log('EditShipment - handleSubmit => Error ', error);
            },
        });
    };

    if (!shipment) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[60vh] w-full overflow-hidden p-0 sm:max-w-2xl">
                <DialogHeader className="border-b px-5 py-3">
                    <DialogTitle>Edit Shipment {shipment.tracking_number ? `#${shipment.tracking_number}` : `ID: ${shipment.id}`}</DialogTitle>
                    <DialogDescription>
                        Update the shipment details.
                        <span className="text-sm font-bold italic">
                            Fields marked with {<Asterisk color={'red'} size={12} className={'inline-flex align-super'} />}
                            are required
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 px-5 md:grid-cols-2">
                        <div>
                            <Label htmlFor="edit-tracking_number">Tracking Number</Label>
                            <Input
                                id="edit-tracking_number"
                                type="text"
                                value={data.tracking_number}
                                onChange={(e) => setData('tracking_number', e.target.value)}
                                placeholder="Enter tracking number"
                                className={errors.tracking_number ? 'border-red-500' : ''}
                            />
                            {errors.tracking_number && <div className="mt-1 text-sm text-red-600">{errors.tracking_number}</div>}
                        </div>

                        <div>
                            <Label htmlFor="edit-carrier">Carrier</Label>
                            <Input
                                id="edit-carrier"
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
                        <Label htmlFor="edit-status">Status</Label>
                        <Select value={data.status} onValueChange={(value) => setData('status', value as ShipmentStatus)}>
                            <SelectTrigger id="edit-status" className={errors.status ? 'border-red-500' : ''}>
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
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea
                            id="edit-notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                            placeholder="Additional information about this shipment"
                        />
                        {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                    </div>

                    {shipment.orders_count > 0 && (
                        <div className="mx-5 rounded-md bg-blue-50 p-2 text-blue-800">
                            <p className="text-sm font-medium">
                                <CircleAlert className="mr-2 mb-1 inline-block h-5 w-5" />
                                This shipment has {shipment.orders_count} associated orders.
                            </p>
                        </div>
                    )}

                    <DialogFooter className="sticky bottom-0 border-t bg-background px-5 py-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className={'px-6'}>
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
