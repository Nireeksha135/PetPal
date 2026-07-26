import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * Tracks cursor position across the viewport and returns smoothed,
 * normalized (-1..1) motion values for driving layered parallax drift.
 */
export function usePageParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 45, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 45, damping: 22, mass: 0.6 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      x.set((e.clientX / window.innerWidth - 0.5) * 2);
      y.set((e.clientY / window.innerHeight - 0.5) * 2);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return { x: springX, y: springY };
}
