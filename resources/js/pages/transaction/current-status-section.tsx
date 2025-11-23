import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getFormattedAmount } from '@/lib/utils';
import { ReceiptText, TrendingDown, TrendingUp } from 'lucide-react';

type Props = {
    totalIncome: number;
    totalOutcome: number;
    totalTransactions: number;
};

export default function CurrentStatusSection({ totalIncome = 0, totalOutcome = 0, totalTransactions = 0 }: Props) {
    const net = totalIncome - totalOutcome;
    const netPositive = net >= 0;

    return (
        <section aria-labelledby="current-status" className="mb-6">
            <h2 id="current-status" className="sr-only">
                Current status
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Transactions */}
                <Card className="relative overflow-hidden border border-slate-200 bg-white/70 shadow-lg backdrop-blur-lg transition-shadow hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/80">
                    <CardHeader className="flex flex-row items-center justify-between py-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
                        <ReceiptText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="relative overflow-hidden py-2">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-gray-300/80 via-slate-100/40 to-transparent dark:from-slate-700/70 dark:via-slate-600/30"
                        />
                        <div className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-200">{totalTransactions}</div>
                        <p className="mt-1 text-sm text-muted-foreground">All records</p>
                    </CardContent>
                </Card>

                {/* Income */}
                <Card className="relative overflow-hidden border border-emerald-200 bg-white/70 shadow-lg backdrop-blur-lg transition-shadow hover:shadow-2xl dark:border-emerald-500 dark:bg-slate-900/80">
                    <CardHeader className="flex flex-row items-center justify-between py-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent className="relative overflow-hidden py-2">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-emerald-200/80 via-emerald-100/40 to-transparent dark:from-emerald-500/70 dark:via-emerald-500/30"
                        />
                        <div className="text-2xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-500">
                            {getFormattedAmount(totalIncome, '₪')}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">All incoming amounts</p>
                    </CardContent>
                </Card>

                {/* Outcome */}
                <Card className="relative overflow-hidden border border-red-200 bg-white/70 shadow-lg backdrop-blur-lg transition-shadow hover:shadow-2xl dark:border-red-500 dark:bg-slate-900/80">
                    <CardHeader className="flex flex-row items-center justify-between py-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Outcome</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent className="relative overflow-hidden py-2">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-red-200/80 via-red-100/40 to-transparent dark:from-red-500/70 dark:via-red-500/30"
                        />
                        <div className="text-2xl font-semibold tracking-tight text-red-700 dark:text-red-500">
                            {getFormattedAmount(totalOutcome, '₪')}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">All outgoing amounts</p>
                    </CardContent>
                </Card>

                {/* Net */}
                <Card
                    className={`relative overflow-hidden border bg-white/70 shadow-lg backdrop-blur-lg transition-shadow hover:shadow-2xl dark:bg-slate-900/80 ${
                        netPositive ? 'border-emerald-200 dark:border-emerald-500' : 'border-red-200 dark:border-red-500'
                    }`}
                >
                    <CardHeader className="relative z-10 flex flex-row items-center justify-between py-1">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Difference</CardTitle>
                        {netPositive ? <TrendingUp className="h-4 w-4 text-emerald-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
                    </CardHeader>
                    <CardContent className="relative overflow-hidden py-1">
                        <div
                            aria-hidden="true"
                            className={`pointer-events-none absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l ${
                                netPositive
                                    ? 'from-emerald-200/80 via-emerald-100/40 to-transparent dark:from-emerald-500/70 dark:via-emerald-500/30'
                                    : 'from-red-200/80 via-red-100/40 to-transparent dark:from-red-500/70 dark:via-red-500/30'
                            }`}
                        />
                        <div className="relative z-10">
                            <div
                                className={`text-2xl font-semibold tracking-tight ${
                                    netPositive ? 'text-emerald-700 dark:text-emerald-500' : 'text-red-700 dark:text-red-500'
                                }`}
                            >
                                {getFormattedAmount(net, '₪')}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge variant={netPositive ? 'default' : 'destructive'} className="capitalize">
                                    {netPositive ? 'surplus' : 'deficit'}
                                </Badge>
                                <Separator orientation="vertical" className="h-4" />
                                <span className="text-sm text-muted-foreground">Income − Outcome</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
