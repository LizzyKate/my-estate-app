import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="size-[22px] shrink-0 rounded-[6px] bg-primary" />
      <span className="font-sans text-[13px] font-extrabold tracking-[0.14em] text-text uppercase">
        MyEstate
      </span>
    </div>
  );
}
