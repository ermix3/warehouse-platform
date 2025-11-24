import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type MyTooltipProps = {
    children: React.ReactNode;
    title: string;
    className?: {
        trigger?: string;
        contentWrapper?: string;
        subContent?: string;
    };
};

export default function MyTooltip({ children, title, className }: Readonly<MyTooltipProps>) {
    return (
        <Tooltip>
            <TooltipTrigger asChild className={className?.trigger}>
                {children}
            </TooltipTrigger>
            <TooltipContent className={className?.contentWrapper}>
                <p className={className?.subContent}>{title}</p>
            </TooltipContent>
        </Tooltip>
    );
}
