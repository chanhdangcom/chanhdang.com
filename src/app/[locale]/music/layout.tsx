import { ReactNode } from "react";

// import { DisableRightClick } from "@/features/music/disable-right-click";

type Props = {
  children: ReactNode;
};

export default function MusicLayout({ children }: Props) {
  return (
    <>
      {/* <DisableRightClick /> */}

      {children}
    </>
  );
}
