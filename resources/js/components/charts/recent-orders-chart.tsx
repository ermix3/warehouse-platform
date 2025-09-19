import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { show } from '@/routes/orders';
import { router } from '@inertiajs/react';
import { TextSearch } from 'lucide-react';

interface RecentOrdersChartProps {
    data: Array<{
        id: number;
        total: number;
        created_at: string;
        customer: {
            name: string;
            email: string;
        };
        items: Array<{
            quantity: number;
            product: {
                name: string;
            };
        }>;
    }>;
}

export function RecentOrdersChart({ data }: Readonly<RecentOrdersChartProps>) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id}</TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{order.customer.name}</div>
                                        <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    AED {Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell>{formatDate(order.created_at)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.visit(show.url(order.id))}
                                        className={'hover:cursor-pointer'}
                                    >
                                        <TextSearch />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
