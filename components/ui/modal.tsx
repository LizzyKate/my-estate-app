"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onOpenChange,
  width = 660,
  children,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  width?: number;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[rgba(4,6,11,0.74)] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content
          style={{ maxWidth: width }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col overflow-y-auto bg-surface p-6 outline-none sm:inset-auto sm:top-14 sm:left-1/2 sm:w-full sm:-translate-x-1/2 sm:rounded-modal sm:border sm:border-primary/16 sm:p-7 sm:px-[30px] sm:shadow-modal"
          )}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { Dialog };
