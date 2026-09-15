"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Placeholder } from "@/components/ui/placeholder";
import { useStore } from "@/lib/store";
import { useSignedInResident } from "@/hooks/use-signed-in-resident";

export default function ResidentReportPage() {
  const reportIssue = useStore((s) => s.reportIssue);
  const me = useSignedInResident();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !category.trim()) return;
    reportIssue(title, category);
    setTitle("");
    setCategory("");
    setDetails("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  if (me && !me.isPrimary) {
    return (
      <div className="max-w-xl space-y-[18px]">
        <div>
          <h1 className="text-[24px] font-bold text-text">Report an issue</h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Only the primary resident can file a maintenance report for this
            household — ask them to submit it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-[18px]">
      <div>
        <h1 className="text-[24px] font-bold text-text">Report an issue</h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Goes straight to the estate admin&rsquo;s maintenance queue.
        </p>
      </div>

      <Card className="p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="What's wrong">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Leaking pipe by the clubhouse" />
          </Field>
          <Field label="Category">
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Plumbing, electrical, security…" />
          </Field>
          <Field label="Details (optional)">
            <Textarea rows={4} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Anything the maintenance team should know" />
          </Field>
          <Placeholder caption="Photo" className="h-24 w-full" />
          <Button type="submit" className="self-start">
            Submit report
          </Button>
          {submitted && (
            <p className="text-[13px] font-medium text-green">
              Logged — the estate admin can see it in the maintenance queue.
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
