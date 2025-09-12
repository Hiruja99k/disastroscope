import { useEffect, useMemo, useRef } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

/**
 * CursorFollower renders a sleek, tech-styled blue glow that smoothly chases the pointer.
 * Uses requestAnimationFrame + lerp for buttery motion and velocity-reactive visuals.
 */
export default function CursorFollower() {
  const coreDotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  

  const state = useMemo(() => ({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    vx: 0,
    vy: 0,
    lastT: 0,
    rafId: 0 as number | 0,
    isPointerMoved: false,
  }), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPointerMove = (e: PointerEvent) => {
      state.targetX = e.clientX;
      state.targetY = e.clientY;
      if (!state.isPointerMoved) {
        state.currentX = e.clientX;
        state.currentY = e.clientY;
        state.isPointerMoved = true;
      }
    };

    const onResize = () => {
      // keep targets in bounds on resize
      state.targetX = clamp(state.targetX, 0, window.innerWidth);
      state.targetY = clamp(state.targetY, 0, window.innerHeight);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    const animate = (t: number) => {
      const coreDot = coreDotRef.current;
      const ring = ringRef.current;
      if (!coreDot || !ring) {
        state.rafId = requestAnimationFrame(animate);
        return;
      }

      const dt = state.lastT ? (t - state.lastT) / 16.6667 : 1; // ~frames
      state.lastT = t;

      // Follow with slight smoothing; higher when moving fast
      const dx = state.targetX - state.currentX;
      const dy = state.targetY - state.currentY;
      const distance = Math.hypot(dx, dy);
      const baseFollow = 0.18;
      const dynamic = clamp(distance / 300, 0, 0.22);
      const followT = clamp((baseFollow + dynamic) * dt, 0, 0.45);

      const nx = lerp(state.currentX, state.targetX, followT);
      const ny = lerp(state.currentY, state.targetY, followT);

      state.vx = nx - state.currentX;
      state.vy = ny - state.currentY;
      state.currentX = nx;
      state.currentY = ny;

      const speed = clamp(Math.hypot(state.vx, state.vy), 0, 24);

      // Core dot
      coreDot.style.transform = `translate3d(${nx}px, ${ny}px, 0) translate(-50%, -50%)`;

      // Outer ring slightly scales with speed
      const ringScale = 1 + speed * 0.015;
      ring.style.transform = `translate3d(${nx}px, ${ny}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      ring.style.opacity = `${0.8}`;

      // No trailing elements

      state.rafId = requestAnimationFrame(animate);
    };

    state.rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      if (state.rafId) cancelAnimationFrame(state.rafId);
    };
  }, [state]);

  // Styles are inline to avoid relying on app CSS; pointer-events disabled to not block UI
  return (
    <>
      {/* trailing elements removed */}
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 38,
          height: 38,
          borderRadius: 9999,
          pointerEvents: "none",
          zIndex: 1000,
          border: "2px solid rgba(80,170,255,0.9)",
          boxShadow: "0 0 12px rgba(80,170,255,0.6)",
          background: "transparent",
          willChange: "transform, opacity",
        }}
      />
      {/* Core dot */}
      <div
        ref={coreDotRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 10,
          height: 10,
          borderRadius: 9999,
          pointerEvents: "none",
          zIndex: 1001,
          background: "#2EA8FF",
          boxShadow: "0 0 10px rgba(0,132,255,0.9)",
          willChange: "transform",
        }}
      />
    </>
  );
}


