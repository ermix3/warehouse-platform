import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SelectOption } from '@/types';

interface SearchableSelectProps {
    readonly options: SelectOption[];
    readonly value: string;
    readonly onValueChange: (value: string) => void;
    readonly placeholder?: string;
    readonly emptyText?: string;
    readonly className?: string;
    readonly disabled?: boolean;
}

export function SearchableSelect({
    options,
    value,
    onValueChange,
    placeholder = "Select option...",
    emptyText = "No option found.",
    className,
    disabled = false,
}: Readonly<SearchableSelectProps>) {
    const [open, setOpen] = useState(false);

    const selectedOption = options.find((option) => option.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label={selectedOption ? selectedOption.label : placeholder}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between",
                        !selectedOption && "text-muted-foreground",
                        className
                    )}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-64 p-0" align="start">
                <Command>
                    <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto " heading="Suggestions">
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => {
                                        const next = value === option.value ? "" : option.value;
                                        onValueChange(next);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
