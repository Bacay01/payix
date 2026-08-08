import { cn } from "@/lib/utils";

const variantClasses = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
  outline: "border border-border bg-background text-foreground hover:bg-secondary",
  ghost: "bg-transparent text-foreground hover:bg-secondary",
};

const sizeClasses = {
  default: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({ className, variant = "primary", size = "default", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}