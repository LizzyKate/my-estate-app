"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** 6 editable boxes for OTP entry, backed by one accessible text input. */
export function OtpBoxes({
  value,
  onChange,
  length = 6,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);

  return (
    <div
      className="relative flex gap-2.5"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, length))
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        maxLength={length}
        aria-label="One-time code"
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
      />
      {Array.from({ length }).map((_, i) => {
        const digit = value[i];
        const isActive = focused && i === value.length;
        return (
          <div
            key={i}
            className={cn(
              "flex h-[62px] w-[52px] items-center justify-center rounded-field border bg-surface font-mono text-[26px] font-bold sm:h-[86px] sm:w-[72px] sm:text-[30px]",
              isActive
                ? "border-[1.5px] border-primary text-primary"
                : "border-primary/14 text-text"
            )}
          >
            {digit ?? ""}
          </div>
        );
      })}
    </div>
  );
}

/** 4 PIN boxes; filled shows a dot instead of the digit. */
export function PinBoxes({
  value,
  length = 4,
}: {
  value: string;
  length?: number;
}) {
  return (
    <div className="flex gap-2.5 sm:gap-3">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex size-[52px] items-center justify-center rounded-field border bg-surface font-mono text-2xl font-bold sm:size-[62px]",
            i < value.length
              ? "border-[1.5px] border-primary text-primary"
              : "border-primary/14 text-subtle"
          )}
        >
          {i < value.length ? "•" : ""}
        </div>
      ))}
    </div>
  );
}

/** wide single readout for the gate code entry screen; empty slots render as "_" */
export function CodeReadout({
  value,
  length = 6,
}: {
  value: string;
  length?: number;
}) {
  const padded = value.padEnd(length, "_");
  const grouped = `${padded.slice(0, 3)} ${padded.slice(3, length)}`;
  return (
    <div className="flex h-[84px] w-full max-w-[520px] items-center justify-center rounded-modal border-[1.5px] border-primary bg-surface font-mono text-[30px] font-bold tracking-[0.18em] text-primary sm:h-[88px] sm:text-[34px]">
      {grouped.split("").map((ch, i) => (
        <span key={i} className={ch === "_" ? "text-subtle" : undefined}>
          {ch}
        </span>
      ))}
    </div>
  );
}
