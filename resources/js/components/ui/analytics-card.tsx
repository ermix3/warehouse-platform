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
}: AnalyticsCardProps) {
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
        <Card className={cn('relative overflow-hidden', variantClasses[variant], className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn('h-4 w-4', iconClasses[variant])} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
                {trend && (
                    <div className="flex items-center space-x-1 text-xs">
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
