import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

const COLORS = [
    '#0088FE', // blue
    '#00C49F', // teal
    '#FFBB28', // yellow
    '#FF8042', // orange
    '#8884D8', // purple
    '#FF6B6B', // red
];

interface OrdersByStatusChartProps {
    data: Array<{
        status: string;
        count: number;
    }>;
}

export function OrdersByStatusChart({ data }: Readonly<OrdersByStatusChartProps>) {
    const chartData = useMemo(() => {
        return data.map((item) => ({
            name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            value: item.count,
        }));
    }, [data]);

    return (
        <Card className="h-[400px] w-full">
            <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            // innerRadius={0} strokeWidth={5} dataKey="value" animationDuration={1000}
                            dataKey="value"
                            innerRadius={30}
                            strokeWidth={5}
                            activeIndex={chartData.findIndex((e) => e.value === Math.max(...chartData.map((e) => e.value)))}
                            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => <Sector {...props} outerRadius={outerRadius + 10} />}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ payload }) => {
                                if (payload && payload[0]) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] text-muted-foreground uppercase">Status</span>
                                                    <span className="font-bold">{payload[0].name}</span>
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[0.70rem] text-muted-foreground uppercase">Orders</span>
                                                    <span className="font-bold">{payload[0].value}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{
                                paddingTop: '20px',
                            }}
                            formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
