"use client";

import { Chip } from "@/components/ui/chip";
import { useStore } from "@/lib/store";

export default function ResidentNoticesPage() {
  const announcements = useStore((s) => s.announcements);

  return (
    <div className="max-w-2xl space-y-[18px]">
      <div>
        <h1 className="text-[24px] font-bold text-text">Estate notices</h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Published by your estate admin.
        </p>
      </div>

      <div className="space-y-3">
        {announcements
          .filter((a) => a.status === "published")
          .map((a) => (
            <div
              key={a.id}
              className="rounded-card border border-primary/10 bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Chip tone="primary">{a.category}</Chip>
                  <span className="font-mono text-[11px] text-faint">
                    {a.publishedAt}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-faint">
                  Seen by {a.seenBy}
                </span>
              </div>
              <p className="mt-2.5 text-[14.5px] font-bold text-text">
                {a.title}
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                {a.body}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
