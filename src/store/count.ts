import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const countAtom = atomWithStorage("count", 0);

export function useCount() {
  return useAtom(countAtom);
}
