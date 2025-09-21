import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type MyTooltipProps = {
    children: React.ReactNode;
    title: string;
};

export default function MyTooltip({ children, title }: MyTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent>
                <p>{title}</p>
            </TooltipContent>
        </Tooltip>
    );
}
