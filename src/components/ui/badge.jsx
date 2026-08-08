import { cn } from "@/lib/utils";

export function Badge({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent",
        className
      )}
    >
      {children}
    </span>
  );
}