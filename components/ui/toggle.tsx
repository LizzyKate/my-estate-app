"use client";

import { cn } from "@/lib/utils";

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-field border border-dashed border-primary/20 bg-sunken px-4 py-3 text-left"
    >
      <span>
        <span className="block text-[13.5px] font-semibold text-text">
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block font-mono text-[11px] text-faint">
            {hint}
          </span>
        )}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-ghost border border-primary/14"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-surface transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}
