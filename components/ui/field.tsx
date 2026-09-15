import * as React from "react";
import { cn } from "@/lib/utils";
import { MonoLabel } from "./mono-label";

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <MonoLabel>{label}</MonoLabel>}
      {children}
      {hint && <p className="text-[12.5px] leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

export const inputClasses = cn(
  "h-[50px] w-full rounded-field border border-primary/12 bg-sunken px-4 text-[15px] text-text outline-none placeholder:text-subtle",
  "focus:border-[1.5px] focus:border-primary",
  "transition-colors"
);

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }
>(({ className, mono, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(inputClasses, mono && "font-mono tracking-[0.06em]", className)}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none rounded-field border border-primary/12 bg-sunken px-4 py-3 text-[15px] text-text outline-none placeholder:text-subtle",
      "focus:border-[1.5px] focus:border-primary",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
