import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { useAudio } from "@/components/music-provider";

export function PickForYou() {
  const { handlePlayRandomAudio } = useAudio();
  return (
    <div>
      <div className="flex gap-1 text-3xl font-bold">
        <div className="px-1 text-xl text-black dark:text-white">
          Top Pick For You
        </div>
      </div>

      <div className="scrollbar-hide mt-2 flex w-full gap-3 overflow-x-auto px-1.5 text-white">
        <div
          onClick={() => handlePlayRandomAudio()}
          className="animate-bg-gradient h-72 w-56 shrink-0 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 bg-[length:200%_200%]"
        >
          <div className="flex h-full flex-col justify-between">
            <div className="p-4">
              <ChanhdangLogotype className="mb-4 w-24 text-white" />
              <div className="text-4xl font-bold">Get Up!</div>
              <div className="text-3xl">Mix</div>
            </div>

            <div className="rounded-b-xl bg-zinc-700/20 px-4 py-2">
              <div className="text-center">
                Ê Kê Vin, Khầy, Jack - J97 and more
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => handlePlayRandomAudio()}
          className="animate-bg-gradient h-72 w-56 shrink-0 rounded-xl bg-gradient-to-tr from-[#ff6fd8] via-[#3813c2] to-[#4fd1c5] bg-[length:200%_200%]"
        >
          <div className="flex h-full flex-col justify-between">
            <div className="p-4">
              <ChanhdangLogotype className="mb-4 w-24 text-white" />
              <div className="text-4xl font-bold">Chill</div>
              <div className="text-3xl">Mix</div>
            </div>

            <div className="rounded-b-xl bg-zinc-700/20 px-4 py-2">
              <div className="text-center">
                Ê Kê Vin, Khầy, Jack - J97 and more
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => handlePlayRandomAudio()}
          className="animate-bg-gradient h-72 w-56 shrink-0 rounded-xl bg-gradient-to-br from-[#fbd3e9] via-[#bb377d] to-[#fbd3e9] bg-[length:400%_400%] text-white"
        >
          <div className="flex h-full flex-col justify-between">
            <div className="p-4">
              <ChanhdangLogotype className="mb-4 w-24 text-white" />
              <div className="text-4xl font-bold">New Music</div>
              <div className="text-3xl">Mix</div>
            </div>

            <div className="rounded-b-xl bg-zinc-700/20 px-4 py-2">
              <div className="line-clamp-2 text-center">
                Ê Kê Vin, Khầy, Jack - J97, Vũ , Son Tung M-TP and more
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => handlePlayRandomAudio()}
          className="animate-bg-gradient h-72 w-56 shrink-0 rounded-xl bg-gradient-to-br from-[#f83600] via-[#f9d423] to-[#f83600] bg-[length:400%_400%] text-white"
        >
          <div className="flex h-full flex-col justify-between">
            <div className="p-4">
              <ChanhdangLogotype className="mb-4 w-24 text-white" />
              <div className="text-4xl font-bold">Hot</div>
              <div className="text-3xl">Mix</div>
            </div>

            <div className="rounded-b-xl bg-zinc-700/20 px-4 py-2">
              <div className="line-clamp-2 text-center">
                Ê Kê Vin, Khầy, Jack - J97, Vũ , Son Tung M-TP and more
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
