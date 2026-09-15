import { Logo } from "@/components/logo";
import { MonoLabel } from "@/components/ui/mono-label";
import { ESTATE_NAME } from "@/lib/mock-data";

export function AdminMobileHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-primary/10 bg-chrome px-4 lg:hidden">
      <Logo />
      <span className="h-5 w-px bg-primary/12" />
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-bold text-text">{ESTATE_NAME}</p>
        <MonoLabel>Estate admin</MonoLabel>
      </div>
    </header>
  );
}
