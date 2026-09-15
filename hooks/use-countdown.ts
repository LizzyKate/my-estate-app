"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** counts down from `seconds`, calling `onExpire` once it hits 0. `restart()` resets it. */
export function useCountdown(seconds: number, onExpire?: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpireRef.current?.();
      return;
    }
    const id = setTimeout(() => setRemaining((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const restart = useCallback((next: number = seconds) => setRemaining(next), [seconds]);

  const minutes = Math.floor(Math.max(remaining, 0) / 60);
  const secs = Math.max(remaining, 0) % 60;
  const label = `${minutes}:${secs.toString().padStart(2, "0")}`;

  return { remaining, label, restart, expired: remaining <= 0 };
}
