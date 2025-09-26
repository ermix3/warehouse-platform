import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    variant?: 'default' | 'warning' | 'success' | 'destructive';
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function AnalyticsCard({
    title,
    value,
    icon: Icon,
    description,
    variant = 'default',
    trend,
    className,
}: Readonly<AnalyticsCardProps>) {
    const variantClasses = {
        default: '',
        warning: 'border-yellow-200 bg-yellow-50/50',
        success: 'border-green-200 bg-green-50/50',
        destructive: 'border-red-200 bg-red-50/50',
    };

    const iconClasses = {
        default: 'text-muted-foreground',
        warning: 'text-yellow-600',
        success: 'text-green-600',
        destructive: 'text-red-600',
    };

    return (
        <Card
            className={cn(
                'relative overflow-hidden bg-card text-card-foreground border border-border shadow-sm transition-colors',
                'hover:shadow-md hover:ring-1 hover:ring-[var(--ring)]',
                variantClasses[variant],
                className
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium tracking-tight">{title}</CardTitle>
                <Icon className={cn('h-4 w-4', iconClasses[variant])} />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold leading-tight">{value}</div>
                {description && (
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                )}
                {trend && (
                    <div className="mt-2 flex items-center space-x-1 text-xs">
                        <span
                            className={cn(
                                'font-medium',
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            )}
                        >
                            {trend.isPositive ? '+' : ''}
                            {trend.value}%
                        </span>
                        <span className="text-muted-foreground">from last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
