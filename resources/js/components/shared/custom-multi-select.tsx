import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from '@/components/ui/multi-select';
import { SelectOption } from '@/types';

type CustomMultiSelectType = {
    values: string[];
    onValuesChange: (values: string[]) => void;
    placeholder?: string;
    items: SelectOption[];
};

export const CustomMultiSelect = ({ values, onValuesChange, placeholder = 'Select ...', items }: CustomMultiSelectType) => {
    return (
        <MultiSelect values={values} onValuesChange={onValuesChange}>
            <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder={placeholder} />
            </MultiSelectTrigger>
            {/*<MultiSelectContent>*/}
            <MultiSelectContent search={{ placeholder, emptyMessage: 'Not found.' }}>
                <MultiSelectGroup>
                    {items.map(({ label, value }) => (
                        <MultiSelectItem key={value} value={value}>
                            {label}
                        </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
            </MultiSelectContent>
        </MultiSelect>
    );
};
