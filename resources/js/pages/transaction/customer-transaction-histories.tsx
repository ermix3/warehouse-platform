import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { getFormattedAmount } from '@/lib/utils';
import { index } from '@/routes/transactions';
import { BreadcrumbItem } from '@/types';
import { PageCustomerTransactionHistoriesProps, Transaction } from '@/types/transaction';
import { Head, usePage } from '@inertiajs/react';
import { format, isToday, isYesterday } from 'date-fns';
import { CalendarIcon, ListRestart, TrendingDown, TrendingUp, UserCircle2Icon, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function CustomerTransactionHistories() {
    const { customer, transactions, totalIncome, totalOutcome, totalTransactions } = usePage<PageCustomerTransactionHistoriesProps>().props;

    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [transactionType, setTransactionType] = useState<'both' | 'income' | 'outcome'>('both');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Transactions',
            href: index.url(),
        },
        {
            title: customer.name,
            href: '',
        },
        {
            title: 'Histories',
            href: '',
        },
    ];

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const createdAt = new Date(transaction.created_at);

            if (startDate && createdAt < startDate) {
                return false;
            }

            if (endDate) {
                // include the whole end day
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                if (createdAt > endOfDay) {
                    return false;
                }
            }

            if (transactionType !== 'both' && transaction.type !== transactionType) {
                return false;
            }

            return true;
        });
    }, [transactions, startDate, endDate, transactionType]);

    // Group filtered transactions by date for the table sections
    const groupedTransactions = useMemo(() => {
        const groups: Record<string, Transaction[]> = {};

        filteredTransactions.forEach((transaction) => {
            const date = new Date(transaction.created_at);
            let key = format(date, 'dd MMM yyyy');

            if (isToday(date)) {
                key = 'Today';
            } else if (isYesterday(date)) {
                key = 'Yesterday';
            }

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(transaction);
        });

        return groups;
    }, [filteredTransactions]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transactions history - ${customer.name}`} />

            <div className="container my-5 px-5">
                <div className="mb-10 flex items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold tracking-tight">Transaction History</h1>
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-muted-foreground">{customer.name}</p>
                        <UserCircle2Icon size={28} className="text-muted-foreground" />
                    </div>
                </div>

                <GetOverview totalIncome={totalIncome} totalOutcome={totalOutcome} totalTransactions={totalTransactions} />

                <GetFilters
                    startDate={startDate}
                    endDate={endDate}
                    transactionType={transactionType}
                    onChangeStartDate={setStartDate}
                    onChangeEndDate={setEndDate}
                    onChangeTransactionType={setTransactionType}
                    onReset={() => {
                        setStartDate(undefined);
                        setEndDate(undefined);
                        setTransactionType('both');
                    }}
                />

                <div className="space-y-6">
                    {Object.entries(groupedTransactions).map(([dateGroup, groupTransactions]) => {
                        const groupTotal = groupTransactions.reduce((sum, tx) => sum + tx.value * (tx.type === 'income' ? 1 : -1), 0);

                        return (
                            <Card key={dateGroup} className="overflow-hidden pt-3">
                                <CardHeader className="flex items-center justify-between py-0">
                                    <div className="flex flex-col">
                                        <CardTitle className="text-md font-medium text-muted-foreground">{dateGroup}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{groupTransactions.length} transactions</p>
                                    </div>
                                    <div
                                        className={`flex items-center rounded-xl px-4 text-sm font-medium ${groupTotal < 0 ? 'bg-red-50' : 'bg-emerald-50'}`}
                                    >
                                        <p className={`${groupTotal < 0 ? 'text-red-700' : 'text-green-700'}`}>
                                            {getFormattedAmount(groupTotal, '₪')}
                                        </p>
                                        <div className={`flex h-8 w-8 items-center justify-center`}>
                                            {groupTotal < 0 ? (
                                                <TrendingDown size={20} className="text-red-700" />
                                            ) : (
                                                <TrendingUp size={20} className="text-green-700" />
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-[minmax(0,_1.2fr)_minmax(0,_1.5fr)_minmax(0,_1.3fr)_minmax(0,_1fr)] border-b bg-muted/40 p-4 font-medium text-muted-foreground">
                                        <span>Time / ID</span>
                                        <span>Notes</span>
                                        <span className="text-right">Amount</span>
                                    </div>

                                    <div className="divide-y">
                                        {groupTransactions.map((transaction) => (
                                            <div
                                                key={transaction.id}
                                                className="grid grid-cols-[minmax(0,_1.2fr)_minmax(0,_1.5fr)_minmax(0,_1.3fr)_minmax(0,_1fr)] items-center px-4 py-2 text-sm"
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium text-foreground">
                                                        {format(new Date(transaction.created_at), 'HH:mm')}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground">Transaction #{transaction.id}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={transaction.type === 'income' ? 'outline' : 'secondary'}
                                                            className={`border px-2 py-0 text-sm ${
                                                                transaction.type === 'income'
                                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                    : 'border-destructive/30 bg-destructive/5 text-destructive'
                                                            }`}
                                                        >
                                                            {transaction.type === 'income' ? 'Paid' : 'Debited'}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <NotesPreview text={transaction.notes} limit={60} />
                                                </div>

                                                <div className="text-right">
                                                    <p
                                                        className={`text-sm font-semibold ${
                                                            transaction.type === 'income' ? 'text-emerald-600' : 'text-red-700'
                                                        }`}
                                                    >
                                                        {transaction.type === 'income' ? '+' : '-'}
                                                        {getFormattedAmount(transaction.value, '₪')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {filteredTransactions.length === 0 && (
                        <Card>
                            <CardContent className="text-md py-10 text-center text-muted-foreground">
                                No transactions found for this customer.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

const GetOverview = ({ totalIncome, totalOutcome, totalTransactions }: { totalIncome: number; totalOutcome: number; totalTransactions: number }) => {
    return (
        // allow Card's default (bg-card / text-card-foreground) to handle light/dark themes
        <Card className="my-4 border-none py-2 shadow-sm">
            <CardHeader className="border-b border-gray-200 py-2 dark:border-gray-700">
                <CardTitle className="text-md font-medium text-muted-foreground">Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 px-4 py-3 text-sm md:grid-cols-3">
                <div className="flex items-center gap-3 border-b pb-3 last:border-b-0 md:border-r md:border-b-0 md:pr-4 md:pb-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100">
                        <span className="text-xs font-semibold"># </span>
                    </div>
                    <div>
                        <p className="text-md font-medium text-muted-foreground">Transactions</p>
                        <p className="text-lg leading-tight font-semibold">{totalTransactions}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 border-b pb-3 last:border-b-0 md:border-r md:border-b-0 md:pr-4 md:pb-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100">
                        <Wallet className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-md font-medium text-red-700/80">Total Outcome</p>
                        <p className="text-lg leading-tight font-semibold">{getFormattedAmount(totalOutcome, '₪')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:pl-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100">
                        <Wallet className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-md font-medium text-emerald-700/80">Total Income</p>
                        <p className="text-lg leading-tight font-semibold">{getFormattedAmount(totalIncome, '₪')}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const GetFilters = ({
    startDate,
    endDate,
    transactionType,
    onChangeStartDate,
    onChangeEndDate,
    onChangeTransactionType,
    onReset,
}: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    transactionType: 'both' | 'income' | 'outcome';
    onChangeStartDate: (date: Date | undefined) => void;
    onChangeEndDate: (date: Date | undefined) => void;
    onChangeTransactionType: (type: 'both' | 'income' | 'outcome') => void;
    onReset: () => void;
}) => {
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    return (
        <Card className="my-3 border-none bg-muted/40 shadow-none">
            <CardContent className="grid items-end gap-4 md:grid-cols-[minmax(0,_2fr)_minmax(0,_1.5fr)_minmax(0,_2fr)]">
                <div className="flex flex-col space-y-1">
                    <Label className="font-medium text-muted-foreground">Start Date</Label>
                    <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="flex w-full items-center justify-start gap-2 pl-5">
                                <CalendarIcon className="ml-3 h-4 w-4" />
                                {startDate ? <span>{startDate.toLocaleDateString()}</span> : 'Select start date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    onChangeStartDate(date);
                                    setOpenStartDate(false);
                                }}
                                className="w-full"
                                disabled={{
                                    after: new Date(),
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col space-y-1">
                    <Label className="font-medium text-muted-foreground">End Date</Label>
                    <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="flex w-full items-center justify-start gap-2 pl-5">
                                <CalendarIcon className="ml-3 h-4 w-4" />
                                {endDate ? endDate.toLocaleDateString() : 'Select end date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={endDate}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    onChangeEndDate(date);
                                    setOpenEndDate(false);
                                }}
                                className="w-full"
                                disabled={{
                                    after: new Date(),
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col space-y-1">
                    <Label className="font-medium text-muted-foreground">Type</Label>
                    <Select
                        defaultValue="both"
                        value={transactionType}
                        onValueChange={(value) => onChangeTransactionType(value as 'both' | 'income' | 'outcome')}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="both">Both</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="outcome">Outcome</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end md:col-span-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer rounded-md bg-primary px-2 py-1 text-sm text-white transition-colors duration-200"
                        onClick={onReset}
                    >
                        <span className="flex items-center gap-1">
                            <ListRestart className="h-3 w-3" />
                            Reset filters
                        </span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

function NotesPreview({ text, limit = 50 }: Readonly<{ text?: string | null; limit?: number }>) {
    const [expanded, setExpanded] = useState(false);

    if (!text) {
        return <span className="font-medium text-foreground">-</span>;
    }

    const isLong = text.length > limit;
    const displayed = !isLong ? text : expanded ? text : `${text.substring(0, limit)}...`;

    return (
        <div className="flex flex-col flex-wrap items-start">
            <span className={`font-medium text-foreground ${expanded ? 'block' : 'block truncate'}`} title={text}>
                {displayed}
            </span>

            {isLong && (
                <button
                    type="button"
                    onClick={() => setExpanded((s) => !s)}
                    className="hover:text-primary-hover cursor-pointer text-sm font-medium text-indigo-700 underline decoration-wavy transition-colors duration-200"
                >
                    {expanded ? 'less' : 'more'}
                </button>
            )}
        </div>
    );
}
