import { useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Per-element 3D tilt that follows the cursor while hovered — used to give
 * floating foreground cards a physical, "closer to the viewer" feel.
 */
export function useTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(py, [-0.5, 0.5], [intensity, -intensity]),
    { stiffness: 220, damping: 22 },
  );
  const rotateY = useSpring(
    useTransform(px, [-0.5, 0.5], [-intensity, intensity]),
    { stiffness: 220, damping: 22 },
  );
  const lift = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseEnter = () => lift.set(1);
  const onMouseLeave = () => {
    px.set(0);
    py.set(0);
    lift.set(0);
  };

  return {
    ref,
    rotateX,
    rotateY,
    lift,
    handlers: { onMouseMove, onMouseEnter, onMouseLeave },
  };
}
