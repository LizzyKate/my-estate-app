"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

/**
 * True once the persisted store has rehydrated from localStorage. Guards
 * must wait on this before deciding to redirect — otherwise they see the
 * pre-hydration seed state and bounce a signed-in user back to sign-in.
 */
export function useStoreHydrated() {
  // useStore.persist only exists in the browser — the storage getter throws
  // during SSR (no localStorage in Node), which zustand catches internally
  // and skips attaching `.persist` at all. Server render always sees `false`
  // here, which is the correct "not hydrated yet" state anyway.
  const [hydrated, setHydrated] = useState(() => useStore.persist?.hasHydrated() ?? false);

  useEffect(() => {
    if (!useStore.persist) return;
    // localStorage reads resolve synchronously inside zustand's persist
    // middleware, so rehydrate() can finish (and notify listeners) before
    // this line returns — subscribe first, trigger second, then re-check
    // directly as a belt-and-braces fallback.
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    useStore.persist.rehydrate();
    // rehydrate() can finish synchronously for localStorage, which means the
    // listener above may already have fired (and been missed by a *later*
    // subscriber elsewhere) before this line runs — re-check directly so
    // this instance still ends up correct either way.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (useStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  return hydrated;
}
