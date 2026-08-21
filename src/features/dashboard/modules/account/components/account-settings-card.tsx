import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components";

type Props = {
  title: string;
  description: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export const AccountSettingsCard = ({
  title,
  description,
  children,
  action,
  footer,
  className,
}: Props) => {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1 space-y-1.5">
          <h2 className="text-base font-semibold tracking-tight text-ink-50">
            {title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-ink-400">
            {description}
          </p>
          {children ? <div className="pt-3">{children}</div> : null}
        </div>
        {action ? <div className="shrink-0 self-center sm:self-start">{action}</div> : null}
      </CardContent>
      {footer ? (
        <CardFooter className="justify-between gap-3 text-xs text-ink-400">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
};
