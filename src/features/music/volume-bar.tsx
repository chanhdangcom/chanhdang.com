import { SpeakerHigh, SpeakerNone } from "@phosphor-icons/react/dist/ssr";

export function VolumeBar() {
  return (
    <div className="flex items-center justify-between space-x-1 text-white">
      <div className="flex items-center justify-start">
        <SpeakerNone size={18} weight="fill" />
      </div>

      <div className="h-1.5 w-full rounded-full bg-zinc-400" />

      <div className="flex items-center justify-end">
        <SpeakerHigh size={18} weight="fill" className="ml-2" />
      </div>
    </div>
  );
}
