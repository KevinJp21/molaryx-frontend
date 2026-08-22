interface ILogoProps {
  className?: string;
  showWordmark?: boolean;
  /**
   * responsive: mark en móvil, horizontal en desktop (default).
   * fixed: respeta showWordmark sin mirar el breakpoint.
   */
  layout?: "responsive" | "fixed";
  size?: number;
}

export const Logo = ({
  className = "",
  showWordmark = true,
  layout = "responsive",
  size = 28,
}: ILogoProps) => {
  const horizontalWidth = Math.round(size * (315 / 100));

  if (!showWordmark) {
    return (
      <span className={`inline-flex items-center leading-none ${className}`}>
        <img
          src="/images/molaryx_logo.svg"
          alt="Molaryx"
          width={size}
          height={size}
          className="block shrink-0"
          style={{ width: size, height: size }}
        />
      </span>
    );
  }

  if (layout === "fixed") {
    return (
      <span className={`inline-flex items-center leading-none ${className}`}>
        <img
          src="/images/molaryx_logo_horizontal.svg"
          alt="Molaryx"
          width={horizontalWidth}
          height={size}
          className="block shrink-0"
          style={{ width: horizontalWidth, height: size }}
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center leading-none ${className}`}>
      <img
        src="/images/molaryx_logo.svg"
        alt="Molaryx"
        width={size}
        height={size}
        className="block shrink-0 md:hidden"
        style={{ width: size, height: size }}
      />
      <img
        src="/images/molaryx_logo_horizontal.svg"
        alt="Molaryx"
        width={horizontalWidth}
        height={size}
        className="hidden shrink-0 md:block"
        style={{ width: horizontalWidth, height: size }}
      />
    </span>
  );
};
