"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { MaintenanceQueue } from "@/components/admin/maintenance-queue";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { ADMIN_STATS } from "@/lib/mock-data";
import type { AnnouncementCategory } from "@/lib/types";

const CATEGORIES: AnnouncementCategory[] = ["UTILITY", "SECURITY", "EVENT", "DUES"];

export default function AdminAnnouncementsPage() {
  const announcements = useStore((s) => s.announcements);
  const maintenance = useStore((s) => s.maintenance);
  const publishAnnouncement = useStore((s) => s.publishAnnouncement);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("UTILITY");

  const canSubmit = title.trim() && body.trim();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[436px_1fr]">
      <div className="space-y-5">
        <Card className="p-5">
          <h1 className="mb-4 text-[17px] font-bold text-text">
            New announcement
          </h1>
          <div className="flex flex-col gap-4">
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" />
            </Field>
            <Field label="Body">
              <Textarea
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What residents need to know"
                className="border-[1.5px] border-primary"
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 font-mono text-[10.5px] font-semibold tracking-[0.06em]",
                    category === c
                      ? "border-primary bg-primary text-primary-ink"
                      : "border-primary/14 bg-sunken text-muted"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button
                disabled={!canSubmit}
                className="flex-1"
                onClick={() => {
                  publishAnnouncement({ title, body, category, status: "published" });
                  setTitle("");
                  setBody("");
                }}
              >
                Publish to {ADMIN_STATS.householdsActive} households
              </Button>
              <Button
                variant="ghost"
                disabled={!canSubmit}
                onClick={() => {
                  publishAnnouncement({ title, body, category, status: "draft" });
                  setTitle("");
                  setBody("");
                }}
              >
                Draft
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-2.5">
          {announcements
            .filter((a) => a.status === "published")
            .map((a) => (
              <div key={a.id} className="rounded-field border border-primary/10 bg-sunken p-3.5">
                <p className="text-[13.5px] font-semibold text-text">{a.title}</p>
                <p className="mt-1 font-mono text-[10.5px] text-faint">
                  {a.category} · {a.publishedAt} · SEEN BY {a.seenBy}
                </p>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-[17px] font-bold text-text">Maintenance queue</h2>
        <MaintenanceQueue items={maintenance} />
      </div>
    </div>
  );
}
