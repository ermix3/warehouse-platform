import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

type EditableCellProps = {
    value: string | number | null;
    isEditing: boolean;
    onStartEdit: () => void;
    onSave: () => void;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    inputClassName?: string;
    step?: number;
};

export function EditableCell({
    value,
    isEditing,
    onStartEdit,
    onSave,
    onChange,
    onKeyDown,
    className = '',
    inputClassName = 'h-8 w-20',
    step = 1,
}: Readonly<EditableCellProps>) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    if (isEditing) {
        return (
            <Input
                ref={inputRef}
                type="number"
                min="0"
                step={step}
                value={value?.toString() || ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onSave}
                onKeyDown={onKeyDown}
                className={inputClassName}
            />
        );
    }

    return (
        <div
            className={`group relative min-w-[60px] cursor-pointer rounded-md border border-transparent p-1.5 text-center transition-all hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-700 dark:hover:bg-blue-900/40 ${className}`}
            onClick={onStartEdit}
            role={'button'}
        >
            <span className="flex items-center justify-between">
                <span className="flex-1 dark:text-foreground">{value || '0'}</span>
                <span className="invisible ml-1 text-blue-500 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 dark:text-blue-300">
                    <Pencil className="h-4 w-4" />
                </span>
            </span>
        </div>
    );
}
