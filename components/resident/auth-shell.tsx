import { Logo } from "@/components/logo";
import { Placeholder } from "@/components/ui/placeholder";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex shrink-0 flex-col gap-6 border-primary/10 bg-chrome p-8 lg:w-[540px] lg:border-r lg:p-11">
        <Logo />
        <Placeholder
          caption="Estate photography"
          className="min-h-[180px] flex-1 lg:min-h-0"
        />
        <p className="max-w-[400px] text-[21px] leading-[1.45] font-semibold text-text">
          Know exactly who is at your gate — and who let them in.
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:p-11 lg:px-16">
        <div className="w-full max-w-[440px]">{children}</div>
      </div>
    </div>
  );
}
