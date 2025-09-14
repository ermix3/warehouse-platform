import { Button } from '@/components/ui/button';
import React from 'react';

interface AddNewItemProps {
    title: string;
    description?: string;
    buttonLabel: string;
    onButtonClick: () => void;
    children?: React.ReactNode;
}

export function AddNewItem({ title, description, buttonLabel, onButtonClick, children }: Readonly<AddNewItemProps>) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
                {children}
            </div>
            <Button onClick={onButtonClick}>{buttonLabel}</Button>
        </div>
    );
}
