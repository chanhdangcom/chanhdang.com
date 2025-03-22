import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export async function DrawerPlaylist() {
  return (
    <Drawer>
      <DrawerTrigger className="rounded-xl border border-zinc-800 px-4 py-2 shadow-sm hover:underline">
        List
      </DrawerTrigger>

      <DrawerContent className="border border-zinc-800 bg-zinc-950 shadow-sm">
        <DrawerHeader className="border-b border-zinc-900 shadow-sm">
          <div className="absolute inset-0 top-4 mx-auto h-1.5 w-32 rounded-full bg-zinc-800"></div>
          <DrawerTitle className="mx-auto font-mono text-xl"></DrawerTitle>
          <DrawerDescription className="mx-auto font-mono"></DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
