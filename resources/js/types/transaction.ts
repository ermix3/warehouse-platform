import type { BaseEntity, CustomerLite, DataPagination, SharedData, Timestamps } from '@/types/index';

export interface TransactionRequest {
    type: string;
    value: number;
    notes: string;
    customer_id: string;
}

export interface TransactionEditRequest extends TransactionRequest {
    created_at: string;
}

export interface TransactionLite extends Pick<BaseEntity, 'id'> {
    type: string;
    value: number;
}

export interface Transaction extends TransactionLite, Timestamps {
    customer: CustomerLite;
    notes?: string;
}

export interface TransactionByCustomer extends Transaction {
    incomes: number;
    outcomes: number;
    difference: number;
}

export interface PageTransactionProps extends SharedData {
    transactionsByDate: DataPagination<Transaction>;
    transactionsByCustomer: DataPagination<TransactionByCustomer>;
    customers: CustomerLite[];
}

export interface TransactionShowProps extends Pick<SharedData, 'flash'> {
    transaction: Transaction;
    [key: string]: unknown;
}

export interface CreateTransactionProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: CustomerLite[];
}

export interface EditTransactionProps extends CreateTransactionProps {
    transaction: Transaction | null;
}

export interface PageCustomerTransactionHistoriesProps extends SharedData {
    customer: CustomerLite;
    transactions: Transaction[];
    totalIncome: number;
    totalOutcome: number;
    totalTransactions: number;
}
