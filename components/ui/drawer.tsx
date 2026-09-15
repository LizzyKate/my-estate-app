"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

export function Drawer({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[rgba(4,6,11,0.72)]" />
        <Dialog.Content className="fixed top-0 right-0 z-50 flex h-full w-full max-w-[352px] flex-col gap-5 overflow-y-auto border-l border-primary/12 bg-chrome p-6 shadow-sheet outline-none">
          <Dialog.Title className="text-[17px] font-bold text-text">
            {title}
          </Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
