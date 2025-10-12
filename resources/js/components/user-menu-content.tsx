import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserInfo } from '@/components/user-info';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Monitor, Moon, Palette, Settings, Sun } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const { appearance, updateAppearance } = useAppearance();

    const appearanceOptions = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="flex items-center text-xs font-medium text-neutral-500">
                        <Palette className="mr-2 h-3.5 w-3.5" />
                        Appearance
                    </span>
                    <div className="flex items-center gap-1">
                        <TooltipProvider>
                            {appearanceOptions.map(({ value, icon: Icon, label }) => (
                                <Tooltip key={value}>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => updateAppearance(value as Appearance)}
                                            className={cn(
                                                'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                                                appearance === value
                                                    ? 'bg-neutral-100 dark:bg-neutral-700'
                                                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={8}>
                                        {label}
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </TooltipProvider>
                    </div>
                </div>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={edit()} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" href={logout()} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
