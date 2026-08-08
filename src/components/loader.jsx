import { CircleDot } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Spinner({ className }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
      aria-label="Loading"
    />
  );
}

export function PageLoader({ message = "Loading your account…" }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background">
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
        <span className="relative flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CircleDot size={22} />
        </span>
      </span>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}