export function Logo({ className = "", variant = "default" }: { className?: string; variant?: "default" | "light" }) {
  const fg = variant === "light" ? "text-background" : "text-primary";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <rect width="32" height="32" rx="8" className={variant === "light" ? "fill-background" : "fill-primary"} />
        <path
          d="M9 8h10l4 4v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"
          className={variant === "light" ? "fill-primary" : "fill-background"}
        />
        <path
          d="M11 16h10M11 19h10M11 22h6"
          stroke="currentColor"
          className={variant === "light" ? "text-background" : "text-primary"}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className={`font-serif text-lg font-semibold tracking-tight ${fg}`}>Resume & Career</span>
    </div>
  );
}
