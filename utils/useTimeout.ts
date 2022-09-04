import { useRef, useEffect } from "react";

export default function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  // Remember the latest callback if changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    if (delay === null) return;

    function tick() {
      savedCallback.current();
    }
    let id = setTimeout(tick, delay);
    return () => clearTimeout(id);
  }, [delay]);
}
