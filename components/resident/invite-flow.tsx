"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InviteModal } from "@/components/resident/invite-modal";
import { PassIssuedModal } from "@/components/resident/pass-issued-modal";
import type { Pass } from "@/lib/types";
import { cn } from "@/lib/utils";

/** bundles the "Invite a visitor" trigger with the invite + pass-issued modals. */
export function InviteFlow({ className }: { className?: string }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [issuedPass, setIssuedPass] = useState<Pass | null>(null);

  return (
    <>
      <Button
        size="default"
        className={cn("h-12", className)}
        onClick={() => setInviteOpen(true)}
      >
        Invite a visitor
      </Button>
      <InviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onCreated={(pass) => setIssuedPass(pass)}
      />
      <PassIssuedModal
        pass={issuedPass}
        onOpenChange={(open) => !open && setIssuedPass(null)}
      />
    </>
  );
}
