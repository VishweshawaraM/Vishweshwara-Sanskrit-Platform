"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Reveal on scroll.
 *
 * The animation itself is pure CSS (see globals.css). This component only
 * observes intersection and flips one attribute — so the transition runs on the
 * compositor and stays smooth while the browser is busy loading, which is
 * exactly when JS-driven animation drops frames.
 *
 * Fires once. Re-animating on every scroll-past is an animation that a user
 * sees tens of times a session, which is the threshold for removing it.
 */

type RevealProps = {
  children: ReactNode;
  /** Stagger within a group. Keep between 30–80ms; longer feels slow. */
  delay?: number;
  /** "draw" uses a clip-path wipe — for rules, seals and images. */
  variant?: "fade" | "draw";
  as?: ElementType;
  className?: string;
};

export function Reveal({
  children,
  delay = 0,
  variant = "fade",
  as: Component = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Already in view on load (the hero): reveal on the next frame so the
    // transition has a starting state to move from.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.setAttribute("data-visible", "");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    observer.observe(element);

    // Failsafe. Hidden-until-observed means a failure of the observer leaves
    // content permanently invisible — an unacceptable failure mode for a
    // reading site. If nothing has revealed this element within 3 seconds,
    // reveal it regardless.
    const failsafe = window.setTimeout(() => {
      element.setAttribute("data-visible", "");
      observer.disconnect();
    }, 3000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  const style = delay
    ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
    : undefined;

  // The clip variant wraps its children: clipping the OBSERVED element would
  // collapse its intersection rectangle to zero, and the observer would never
  // fire. The outer element stays unclipped and observable.
  if (variant === "draw") {
    return (
      <Component ref={ref} data-draw="" className={className} style={style}>
        <span className="draw-inner">{children}</span>
      </Component>
    );
  }

  return (
    <Component ref={ref} data-reveal="" className={className} style={style}>
      {children}
    </Component>
  );
}
