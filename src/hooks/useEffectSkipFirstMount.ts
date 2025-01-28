import { DependencyList, EffectCallback, useEffect, useRef } from "react"

export const useEffectSkipFirstMount = (callback: EffectCallback, deps?: DependencyList) => {
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      console.log("Skip when first mount");
      isFirstMount.current = false;
      return;
    }

    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}