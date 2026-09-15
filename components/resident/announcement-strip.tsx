import type { Announcement } from "@/lib/types";

export function AnnouncementStrip({ announcement }: { announcement: Announcement }) {
  return (
    <div className="flex items-center gap-3 rounded-field border border-amber/20 bg-amber/8 px-4 py-3">
      <span className="size-2 shrink-0 rounded-full bg-amber" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-bold text-text">
          {announcement.title}
        </p>
        <p className="truncate text-[12.5px] text-muted">{announcement.body}</p>
      </div>
      <span className="shrink-0 font-mono text-[11px] text-faint">
        {announcement.publishedAt}
      </span>
    </div>
  );
}
