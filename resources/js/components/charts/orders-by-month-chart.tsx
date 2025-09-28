import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFormattedAmount } from '@/lib/utils';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface OrdersByMonthChartProps {
    data: Array<{
        month: string;
        count: number;
        revenue: number;
    }>;
}

export function OrdersByMonthChart({ data }: OrdersByMonthChartProps) {
    // Transform the data to have better month labels
    const transformedData = data.map((item) => ({
        ...item,
        monthLabel: new Date(item.month + '-01').toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
        }),
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders by Month</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={transformedData}>
                        <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-md">
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] text-muted-foreground uppercase">Month</span>
                                                    <span className="font-bold text-muted-foreground">{label}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] text-muted-foreground uppercase">Orders</span>
                                                    <span className="font-bold">{payload[0].value}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] text-muted-foreground uppercase">Revenue</span>
                                                    <span className="font-bold">{getFormattedAmount(payload[0].payload.revenue)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="var(--chart-1)"
                            strokeWidth={2}
                            dot={{ fill: 'var(--chart-1)', stroke: 'var(--background)', strokeWidth: 1.5, r: 3.5 }}
                            activeDot={{ r: 6, stroke: 'var(--ring)', fill: 'var(--chart-1)', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
