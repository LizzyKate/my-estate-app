"use client";

import { cn } from "@/lib/utils";

const BACKSPACE = "⌫";
const ENTER = "↵";

export function NumericKeypad({
  onDigit,
  onBackspace,
  onEnter,
  className,
}: {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onEnter?: () => void;
  className?: string;
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", BACKSPACE, "0", ENTER];

  return (
    <div className={cn("grid grid-cols-3 gap-2.5", className)}>
      {keys.map((key) => {
        if (key === ENTER && !onEnter) {
          return <div key={key} aria-hidden />;
        }
        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (key === BACKSPACE) onBackspace();
              else if (key === ENTER) onEnter?.();
              else onDigit(key);
            }}
            className="flex h-[52px] w-full items-center justify-center rounded-key border border-primary/14 bg-ghost font-mono text-[17px] font-medium text-text transition-colors hover:border-primary/28 active:bg-surface"
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
