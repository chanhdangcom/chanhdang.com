"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pause } from "@phosphor-icons/react/dist/ssr";
import { PlayerPage } from "./player-page";

export function Modal() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="backdrop-blur-md">
        <Pause weight="fill" size={30.5} className="cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
      <AlertDialogContent>
        <div>
          <PlayerPage />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
