import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import Link from "next/link";

export function ManagementPage() {
  return (
    <>
      <div className="flex justify-between font-apple">
        <div className="fixed m-4 h-[95vh] w-[30vh] rounded-3xl border border-zinc-900 bg-gradient-to-br from-black to-zinc-900 p-4">
          <div className="mx-auto w-fit text-xl font-semibold">
            <ChanhdangLogotype />
          </div>

          <div className="mt-4 space-y-2">
            <Link href={"/music/add-singer"} className="rounded-2xl p-2">
              Quản Lý Ca Sĩ
            </Link>

            <div className="rounded-2xl p-2">Quản Lý Bài Hát</div>

            <div className="rounded-2xl p-2">Quản Lý Playlist</div>
          </div>
        </div>

        <div className="w-full"></div>
      </div>
    </>
  );
}
