import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CustomPagination,
} from "@/components";

interface BaseTableProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  totalItems: number;
  totalItemsView: number;
  className?: string;
}

export const BaseTable = ({
  title,
  icon,
  actions,
  children,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  totalItems,
  totalItemsView,
  className,
}: BaseTableProps) => {
  return (
    <Card className={cn("h-full w-full gap-0 py-0", className)}>
      {(title || actions) && (
        <CardHeader>
          <div className="flex min-w-0 items-center gap-3">
            {icon && (
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-accent-500 ring-1 ring-inset ring-accent-500/20">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              {title && <CardTitle>{title}</CardTitle>}
            </div>
          </div>
          {actions && <CardAction>{actions}</CardAction>}
        </CardHeader>
      )}

      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </CardContent>

      <CardFooter className="justify-between">
        <p className="text-xs text-ink-400">
          {`${totalItemsView} de ${totalItems} registros en esta página`}
        </p>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
};

export default BaseTable;
