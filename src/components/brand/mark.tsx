/**
 * The Vishweshwara mark.
 *
 * A flat, single-colour redraw of the Acharya's logo — the tree rising from an
 * open book within an unclosed circle, a star above. The supplied original is a
 * metallic gradient with soft shadow, which dates quickly and reproduces badly
 * when small, embossed, or printed in one colour (docs/04 Part 5).
 *
 * This version is line art: it inherits `currentColor`, works in gold on ink and
 * maroon on parchment, scales to a favicon, and can be foil-stamped on a
 * certificate. Line art reads as an engraving, which is the correct register.
 */

type MarkProps = {
  className?: string;
  /** Decorative by default; give a title when it stands alone as the logo. */
  title?: string;
};

export function Mark({ className, title }: MarkProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* The circle of the tradition — deliberately unclosed at the crown,
          where the lineage enters. */}
      <path
        d="M42 12.5A50 50 0 1 0 78 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* The star: the paramparā, the source above. Four points, not five —
          five-pointed stars read as decoration, four as a compass or a spark. */}
      <path
        d="M60 2.5 62.4 12 72 14.4 62.4 16.8 60 26.4 57.6 16.8 48 14.4 57.6 12Z"
        fill="currentColor"
      />

      {/* Trunk, descending from the star into the book. This is the line the
          hero animation draws: knowledge descends, then takes root. */}
      <path
        d="M60 26v62"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Branches — three pairs, rising. */}
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M60 44C60 44 50 40 44 32" />
        <path d="M60 44C60 44 70 40 76 32" />
        <path d="M60 58C60 58 46 55 38 46" />
        <path d="M60 58C60 58 74 55 82 46" />
        <path d="M60 71C60 71 49 69 42 62" />
        <path d="M60 71C60 71 71 69 78 62" />
      </g>

      {/* Leaves — few and deliberate, not a canopy. */}
      <g fill="currentColor" opacity="0.85">
        <ellipse cx="42" cy="30" rx="3.4" ry="5" transform="rotate(-30 42 30)" />
        <ellipse cx="78" cy="30" rx="3.4" ry="5" transform="rotate(30 78 30)" />
        <ellipse cx="36" cy="44" rx="3.2" ry="4.6" transform="rotate(-35 36 44)" />
        <ellipse cx="84" cy="44" rx="3.2" ry="4.6" transform="rotate(35 84 44)" />
        <ellipse cx="40" cy="60" rx="3" ry="4.2" transform="rotate(-40 40 60)" />
        <ellipse cx="80" cy="60" rx="3" ry="4.2" transform="rotate(40 80 60)" />
        <ellipse cx="60" cy="34" rx="3.4" ry="5" />
      </g>

      {/* Roots, spreading into the page. */}
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.9">
        <path d="M60 88C60 88 54 92 49 94" />
        <path d="M60 88C60 88 66 92 71 94" />
        <path d="M60 88C60 88 57 93 55 96" />
        <path d="M60 88C60 88 63 93 65 96" />
      </g>

      {/* The open book. Two leaves meeting at the spine — the śāstra the tree
          grows out of. */}
      <g stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        <path d="M60 97C54 93 40 91 28 92v14c12-1 26 1 32 5Z" />
        <path d="M60 97c6-4 20-6 32-5v14c-12-1-26 1-32 5Z" />
      </g>
      <g stroke="currentColor" strokeWidth="1" opacity="0.4">
        <path d="M34 97.5c7 0 15 1.4 20 3.8" />
        <path d="M86 97.5c-7 0-15 1.4-20 3.8" />
      </g>
    </svg>
  );
}
