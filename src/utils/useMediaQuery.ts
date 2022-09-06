import { useState, useEffect } from "react";

export function useGetWidth() {
  const [width, setWidth] = useState<number>();
  const [breakpoint, setBreakpoint] = useState<BreakpointId>();

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
      setBreakpoint(getBreakpointId(window.innerWidth));
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width, breakpoint };
}

export default function useBreakpoint(id: BreakpointId) {
  const [breakpoint, setBreakpoint] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${BREAKPOINT[id]})`);

    function update() {
      setBreakpoint(media.matches);
    }

    update();

    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [id]);

  return breakpoint;
}

function getBreakpointId(width: number) {
  if (width < BREAKPOINT.sm) return "xs";
  if (width < BREAKPOINT.md) return "sm";
  if (width < BREAKPOINT.lg) return "md";
  if (width < BREAKPOINT.xl) return "lg";
  if (width < BREAKPOINT["2xl"]) return "xl";
  return "2xl";
}

type BreakpointId = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const BREAKPOINT = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1538,
};
