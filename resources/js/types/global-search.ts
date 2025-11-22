export interface GlobalSearchResultItem {
    id: number;
    label: string;
    subtitle?: string | null;
    type: string;
    url: string;
}

export interface GlobalSearchResults {
    customers: GlobalSearchResultItem[];
    suppliers: GlobalSearchResultItem[];
    products: GlobalSearchResultItem[];
    orders: GlobalSearchResultItem[];
    shipments: GlobalSearchResultItem[];
    transactions: GlobalSearchResultItem[];
}

export interface GlobalSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
