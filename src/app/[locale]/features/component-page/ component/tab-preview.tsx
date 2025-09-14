import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function TabPreView() {
  return (
    <div className="">
      <div className="grid grid-cols-2">
        <div className="border border-zinc-800 text-center">
          <ThemeSwitcher />
        </div>
        <div className="border border-zinc-800">ss</div>
      </div>
    </div>
  );
}
