"use client";

import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  mono = true,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "h-[50px] flex-1 rounded-field border px-3 text-[13px] font-semibold transition-colors",
              mono && "font-mono tracking-[0.04em]",
              active
                ? "border-[1.5px] border-primary bg-sunken text-primary"
                : "border-primary/12 bg-sunken text-muted hover:border-primary/20"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
