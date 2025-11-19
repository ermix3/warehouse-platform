import { PageCustomerTransactionHistoriesProps } from "@/types/transaction";
import { Head, usePage } from "@inertiajs/react";

export default function CustomerTransactionHistories() {
    const { customer } = usePage<PageCustomerTransactionHistoriesProps>().props;

    return (
        <>
            <Head title="Customer Transaction Histories" />
            <div>
                <h1>Customer Transaction Histories {customer?.name ?? "else"}</h1>
            </div>
        </>
    );
}