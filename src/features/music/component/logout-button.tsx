"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Power, SignIn, UserCircle } from "phosphor-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export function LogoutButton() {
  const [userName, setUserName] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        setUserName(JSON.parse(user).username);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName(null);
    router.push("/music");
  };

  return (
    <div>
      {!userName ? (
        <Link
          href={"auth/login"}
          className="flex items-center justify-center gap-1 rounded-xl border px-4 py-1 shadow-sm backdrop-blur-sm dark:border-zinc-800"
        >
          <div className="font-semibold">Login</div>

          <SignIn size={25} className="size-6" />
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <div className="flex items-center gap-1">
                <UserCircle size={12} weight="fill" className="size-8" />

                <div className="text-sm font-semibold hover:underline">
                  {userName}
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="space-y-2 rounded-xl border bg-zinc-50 text-lg dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-md rounded-t-md bg-zinc-300 px-1 py-0.5 dark:bg-zinc-900">
              Menu
            </div>

            <div className="text-lg">
              <div className="rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                <Link href={"music/add"} className="flex items-center gap-1">
                  <Plus size={15} className="text-4" fill="bold" />
                  <div>Add Music</div>
                </Link>
              </div>

              <div
                className="flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800"
                onClick={handleLogout}
              >
                <Power className="text-4 text-red-500" fill="bold" size={15} />
                <div>Log Out</div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
