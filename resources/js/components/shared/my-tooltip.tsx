import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type MyTooltipProps = {
    children: React.ReactNode;
    title: string;
    className?: {
        trigger?: string;
        contentWrapper?: string;
        subContent?: string;
    };
    side?: 'top' | 'right' | 'bottom' | 'left';
};

export default function MyTooltip({ children, title, className, side }: Readonly<MyTooltipProps>) {
    return (
        <Tooltip>
            <TooltipTrigger asChild className={className?.trigger}>
                {children}
            </TooltipTrigger>
            <TooltipContent className={className?.contentWrapper} side={side}>
                <p className={className?.subContent}>{title}</p>
            </TooltipContent>
        </Tooltip>
    );
}
