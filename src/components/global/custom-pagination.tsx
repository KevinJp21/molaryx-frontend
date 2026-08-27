'use client'

import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export const CustomPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false
}: CustomPaginationProps) => {
    const pageButtonClass = cn(
        "flex size-8 items-center justify-center rounded-lg border border-ink-250 bg-ink-50 text-ink-700 transition-colors",
        "hover:border-accent-500/30 hover:bg-accent-500/8 hover:text-accent-600",
        "disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
    )

    return (
        <div className="flex items-center gap-1.5">
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={pageButtonClass}
                aria-label="Página anterior"
            >
                <ArrowLeft className="size-3.5" strokeWidth={2} />
            </button>

            <div className="mx-1 flex h-8 min-w-16 items-center justify-center rounded-lg px-2.5 text-xs font-medium text-ink-700 ring-1 ring-inset ring-accent-500/15">
                {currentPage}
                <span className="mx-1 text-ink-600/70">/</span>
                {totalPages || 1}
            </div>

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className={pageButtonClass}
                aria-label="Página siguiente"
            >
                <ArrowRight className="size-3.5" strokeWidth={2} />
            </button>
        </div>
    )
}
