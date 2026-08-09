"use client";

import { useEffect, useRef } from "react";

import { Mark } from "./mark";

/**
 * The seal — the hero's 3D object.
 *
 * WHY NOT WEBGL, AND WHY NOT FRAMER MOTION.
 * Three.js costs ~600kB to render what a CSS 3D transform renders for free.
 * Framer Motion was measured at 40kB gzipped for this one decorative tilt —
 * more than a third of the entire JS budget for a marketing page. Both were
 * removed. What remains is `preserve-3d` plus a pointer listener that writes
 * `transform` directly.
 *
 * The spring feeling comes from the CSS transition, not from a physics library.
 * Because a transition retargets from its current position on every pointer
 * move, the mark follows the cursor with damping and momentum — the same
 * perceptual result a spring gives, composited on the GPU, at ~0.5kB.
 *
 * Why it animates at all: the mark is a seal, a pressed physical object.
 * Catching the light as you move past it is what tells you it has substance.
 * Purely decorative — which is exactly when this kind of motion is justified,
 * and exactly why it is disabled for reduced motion and for touch.
 */

const MAX_TILT = 9;

export function Seal({ className }: { className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = frame.current?.parentElement;
    const plane = frame.current;
    const highlight = glow.current;
    if (!container || !plane) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !container || !plane) return;
      const box = container.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;

      // Written directly on the element rather than through a CSS variable on
      // the parent — a variable change would recalculate styles for every child.
      plane.style.transform = `rotateX(${-y * MAX_TILT}deg) rotateY(${x * MAX_TILT}deg)`;
      if (highlight) {
        highlight.style.backgroundPosition = `${50 + x * 40}% ${50 + y * 40}%`;
      }
    }

    function rest() {
      if (plane) plane.style.transform = "rotateX(0deg) rotateY(0deg)";
      if (highlight) highlight.style.backgroundPosition = "50% 50%";
    }

    container.addEventListener("pointermove", move);
    container.addEventListener("pointerleave", rest);
    return () => {
      container.removeEventListener("pointermove", move);
      container.removeEventListener("pointerleave", rest);
    };
  }, []);

  return (
    <div className={className} style={{ perspective: 900 }}>
      <div
        ref={frame}
        className="relative [transform-style:preserve-3d] [transition:transform_600ms_var(--ease-out-strong)] motion-reduce:[transition:none]"
      >
        <div
          ref={glow}
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(closest-side,rgb(255_246_214/0.18),transparent_72%)] [background-position:50%_50%] [background-repeat:no-repeat] [background-size:70%_70%] [transform:translateZ(22px)] [transition:background-position_600ms_var(--ease-out-strong)]"
        />
        <Mark
          title="Vishweshwara Sanskrit"
          className="text-gold-500 relative w-full drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)]"
        />
      </div>
    </div>
  );
}
