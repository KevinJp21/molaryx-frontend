interface ILogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}

export const Logo = ({ className = "", showWordmark = true, size = 28 }: ILogoProps) => {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {showWordmark && (
        <span className="text-[17px] font-semibold tracking-tight text-ink-50">
          Molaryx
        </span>
      )}
    </span>
  );
};
