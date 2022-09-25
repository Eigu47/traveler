import { useEffect, useRef } from "react";

export default function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  // Remember the latest callback if changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(savedCallback.current, delay);
    return () => clearTimeout(id);
  }, [delay]);
}
