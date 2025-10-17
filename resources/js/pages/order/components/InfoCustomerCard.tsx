import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types';

export function InfoCustomerCard({ order }: Readonly<{ order: Order }>) {
    if (!order.customer) {
        return (
            <Card className="pt-3">
                <CardHeader className="border-b-2 pb-2">
                    <CardTitle className="text-md">Customer Info</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">No customer information available</CardContent>
            </Card>
        );
    }

    return (
        <Card className="pt-3">
            <CardHeader className="border-b-2 pb-2">
                <CardTitle className="text-md">Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Code:</div>
                    <div className="text-sm text-muted-foreground">{order.customer.code || '-'}</div>

                    <div className="text-sm font-medium">Name:</div>
                    <div className="text-sm text-muted-foreground">{order.customer.name || '-'}</div>

                    <div className="text-sm font-medium">Email:</div>
                    <div className="text-sm text-muted-foreground">{order.customer.email || '-'}</div>

                    <div className="text-sm font-medium">Phone:</div>
                    <div className="text-sm text-muted-foreground">{order.customer.phone || '-'}</div>

                    <div className="text-sm font-medium">Address:</div>
                    <div className="text-sm text-muted-foreground">{order.customer.address || '-'}</div>
                </div>
            </CardContent>
        </Card>
    );
}
