type MyDividerProps = {
    label: string;
};

export const MyDivider = ({ label }: MyDividerProps) => {
    return (
        <div className="mt-6 mb-2 flex items-center">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></span>
            <span className="shrink-0 px-4 text-gray-900 dark:text-white">{label}</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
        </div>
    );
};
