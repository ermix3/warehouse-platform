import { DataTable, DeleteItem, Pagination, TitleActionsSection } from '@/components/shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActionsEnum, ResourcesEnum } from '@/enums';
import { usePermission } from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { destroy, index } from '@/routes/transactions';
import { BreadcrumbItem } from '@/types';
import { PageTransactionProps, Transaction } from '@/types/transaction';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { createColumnsByDate } from './columns';
import { createColumnsByCustomer } from './columns-by-customer';
import CreateTransaction from './create-transaction';
import EditTransaction from './edit-transaction';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
    {
        title: 'Transactions',
        href: index.url('date'),
    },
    {
        title: 'Listing all transactions',
        href: '',
    },
];

export default function TransactionsPage() {
    const { transactionsByDate, transactionsByCustomer, filters, flash, customers } = usePage<PageTransactionProps>().props;
    const [activeTab, setActiveTab] = useState('date');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateDialog = () => setShowCreateDialog(true);

    const openEditDialog = (transaction: Transaction) => {
        setEditTransaction(transaction);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (transaction: Transaction) => {
        setDeleteTransaction(transaction);
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteTransaction) return;

        setIsDeleting(true);
        router.delete(destroy(deleteTransaction.id).url, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setDeleteTransaction(null);
            },
            onError: (error) => {
                console.error('Failed to delete transaction: ', error);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setShowDeleteDialog(false);
            setDeleteTransaction(null);
        }
    };

    //##############//#####################//#############
    //##############// Handle Permissions //##############
    //#############//####################//###############
    const { hasPermission } = usePermission();
    const canCreate = hasPermission(ActionsEnum.CREATE, ResourcesEnum.TRANSACTIONS);
    const canEdit = hasPermission(ActionsEnum.EDIT, ResourcesEnum.TRANSACTIONS);
    const canDelete = hasPermission(ActionsEnum.DELETE, ResourcesEnum.TRANSACTIONS);

    const columnsByDate = createColumnsByDate(openEditDialog, openDeleteDialog, canEdit, canDelete);
    const columnsByCustomer = createColumnsByCustomer();

    const handleTabChange = (tab: string) => {
        // reset the filters
        filters.search = '';
        filters.sort_by = tab === 'date' ? 'created_at' : 'id';
        filters.sort_order = 'desc';
        router.get(index(tab).url, {
            search: '',
            sort_by: tab === 'date' ? 'created_at' : 'id',
            sort_order: 'desc',
        }, {
            preserveState: true,
            preserveScroll: true,
        });
        setActiveTab(tab);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Transactions" />

            <div className="container mt-5 px-5">
                <TitleActionsSection
                    title="Transactions"
                    description="Manage your transactions"
                    btnAddLabel="Create Transaction"
                    onBtnAddClick={openCreateDialog}
                    canAdd={canCreate}
                />

                <Tabs defaultValue="account" value={activeTab} onValueChange={handleTabChange} className=" space-y-4">
                    <TabsList>
                        <TabsTrigger value="date" className="hover:cursor-pointer">
                            By date
                        </TabsTrigger>
                        <TabsTrigger value="customer" className="hover:cursor-pointer">
                            By Customer
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="date" className="space-y-4">
                        <DataTable
                            columns={columnsByDate}
                            data={transactionsByDate.data}
                            filters={filters}
                            searchPlaceholder="Search transactions by name, email, phone, address, or notes..."
                        />

                        <Pagination
                            links={transactionsByDate.links}
                            from={transactionsByDate.from}
                            to={transactionsByDate.to}
                            total={transactionsByDate.total}
                        />
                    </TabsContent>
                    <TabsContent value="customer" className="space-y-4">
                        <DataTable
                            columns={columnsByCustomer}
                            data={transactionsByCustomer.data}
                            filters={filters}
                            searchPlaceholder="Search transactions by name, email, phone, address, or notes..."
                        />

                        <Pagination
                            links={transactionsByCustomer.links}
                            from={transactionsByCustomer.from}
                            to={transactionsByCustomer.to}
                            total={transactionsByCustomer.total}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Create Dialog */}
            <CreateTransaction open={showCreateDialog} onOpenChange={setShowCreateDialog} customers={customers} />

            {/* Edit Dialog */}
            <EditTransaction open={showEditDialog} onOpenChange={setShowEditDialog} transaction={editTransaction} customers={customers} />

            {/* Delete Confirmation Dialog */}
            <DeleteItem
                open={showDeleteDialog}
                onOpenChange={closeDeleteDialog}
                title="Delete Transaction"
                itemName={`Transaction N*: ${deleteTransaction?.id} `}
                description="This action cannot be undone."
                isDeleting={isDeleting}
                onDelete={handleDelete}
            />
        </AppLayout>
    );
}
