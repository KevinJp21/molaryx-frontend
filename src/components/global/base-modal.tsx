'use client';

import {
    Root as DialogRoot,
    DialogPortal,
    DialogContent,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    iconClassName?: string;
    children: React.ReactNode;
    className?: string;
};

export const BaseModal = ({
    open,
    onOpenChange,
    title,
    description,
    icon,
    iconClassName,
    children,
    className,
}: Props) => {
    const hasHeaderCopy = Boolean(title || description || icon);

    return (
        <DialogRoot open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay
                    className={cn(
                        'fixed inset-0 z-40 bg-ink-950/20 backdrop-blur-[2px]',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                    )}
                />
                <DialogContent
                    className={cn(
                        'fixed left-1/2 top-1/2 z-50 flex max-h-[min(92vh,840px)] w-[calc(100vw-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-ink-250 bg-ink-50 text-ink-900 shadow-[0_1px_0_rgba(14,14,23,0.04),0_24px_64px_-32px_rgba(124,77,255,0.45)]',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                        className,
                    )}
                >
                    <div
                        className={cn(
                            'flex shrink-0 items-start gap-3 px-5 py-4',
                            hasHeaderCopy ? 'justify-between border-b border-ink-200' : 'justify-end',
                        )}
                    >
                        {hasHeaderCopy ? (
                            <div className="flex min-w-0 items-center gap-3">
                                {icon && (
                                    <span
                                        className={cn(
                                            'flex size-8 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-accent-500 ring-1 ring-inset ring-accent-500/20',
                                            iconClassName,
                                        )}
                                    >
                                        {icon}
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <DialogTitle
                                        className={cn(
                                            title
                                                ? 'text-sm font-medium tracking-tight text-ink-950'
                                                : 'sr-only',
                                        )}
                                    >
                                        {title ?? 'Diálogo'}
                                    </DialogTitle>
                                    {description && (
                                        <DialogDescription className="text-xs text-ink-600">
                                            {description}
                                        </DialogDescription>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <DialogTitle className="sr-only">Diálogo</DialogTitle>
                        )}

                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Cerrar"
                                className="shrink-0"
                            >
                                <X className="size-4" />
                            </Button>
                        </DialogClose>
                    </div>

                    {children}
                </DialogContent>
            </DialogPortal>
        </DialogRoot>
    );
};
