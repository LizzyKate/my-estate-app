"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
import { MonoLabel } from "@/components/ui/mono-label";
import { useStore } from "@/lib/store";
import type { Pass } from "@/lib/types";

export function PassIssuedModal({
  pass,
  onOpenChange,
}: {
  pass: Pass | null;
  onOpenChange: (open: boolean) => void;
}) {
  const revokePass = useStore((s) => s.revokePass);
  const [copied, setCopied] = useState(false);

  if (!pass) return null;
  const firstName = pass.name.split(" ")[0];

  return (
    <Modal open={!!pass} onOpenChange={onOpenChange} width={660} title="Pass issued">
      <div className="grid gap-7 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Placeholder caption="QR placeholder" className="aspect-square w-full" />
          <Button variant="primary" size="default" className="h-[46px]">
            Share via WhatsApp
          </Button>
          <Button variant="ghost" size="default" className="h-[46px]">
            Download / print
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-green text-green-ink">
              ✓
            </span>
            <MonoLabel className="text-green">Pass issued</MonoLabel>
          </div>

          <div>
            <h2 className="text-[27px] leading-[1.2] font-bold text-text">
              {firstName} is expected today.
            </h2>
            <p className="mt-1.5 text-[13.5px] text-muted">
              {pass.window} · one entry, one exit.
            </p>
          </div>

          <div className="rounded-field border border-primary/12 bg-sunken p-4">
            <MonoLabel>Entry code — read it out at the gate</MonoLabel>
            <p className="mt-2 font-mono text-[38px] font-bold tracking-[0.1em] text-primary">
              {pass.code}
            </p>
            <p className="mt-1 font-mono text-[10.5px] text-faint">
              SINGLE USE · HOUSE {pass.house}
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-2.5 sm:flex-row">
            <Button
              variant="ghost"
              size="default"
              onClick={() => {
                navigator.clipboard?.writeText(pass.code).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? "Copied" : "Copy code"}
            </Button>
            <Button
              variant="danger"
              size="default"
              onClick={() => {
                revokePass(pass.id);
                onOpenChange(false);
              }}
            >
              Revoke pass
            </Button>
            <Button
              variant="primary"
              size="default"
              className="sm:ml-auto"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
