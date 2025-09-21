import { ExportData } from '@/components/shared';
import { Button } from '@/components/ui/button';
import React from 'react';

interface TitleActionsSectionProps {
    title?: string;
    description?: string;
    btnAddLabel?: string;
    onBtnAddClick?: () => void;
    children?: React.ReactNode;
    onBtnExportClick?: (type: 'csv' | 'excel') => void;
}

export function TitleActionsSection({
    title,
    description,
    btnAddLabel,
    onBtnAddClick,
    onBtnExportClick,
    children,
}: Readonly<TitleActionsSectionProps>) {
    return (
        <div className={`mb-6 flex items-center ${title == undefined ? 'justify-end' : 'justify-between'} `}>
            {title && (
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    {description && <p className="text-muted-foreground">{description}</p>}
                    {children}
                </div>
            )}
            <div className={`flex items-center gap-2`}>
                {onBtnExportClick && <ExportData onExport={onBtnExportClick} />}
                {onBtnAddClick && <Button onClick={onBtnAddClick}>{btnAddLabel}</Button>}
            </div>
        </div>
    );
}
