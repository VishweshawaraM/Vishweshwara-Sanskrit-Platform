/**
 * The Vishweshwara mark.
 *
 * A faithful vector redraw of the Acharya's logo: the tree rising from an open
 * book inside an all-but-closed circle, a star at the crown, and the hanging
 * bead-strands that make the mark recognisably his rather than a generic
 * tree-of-life.
 *
 * Vector rather than the supplied raster because this mark has to work at
 * 16px in a browser tab, embossed on a certificate, in one colour on a
 * letterhead, and in gold on the ink hero. It inherits `currentColor`.
 *
 * NOTE: the Acharya has asked for the original gold-gradient artwork to be
 * used. Drop the real file at `public/brand/logo.png` (or .svg) and switch the
 * imports in site-header, site-footer and seal — the artwork is not in the
 * repository yet. This vector stands in until then, and should remain the
 * favicon and the certificate stamp regardless, where a gradient raster
 * reproduces badly.
 */

type MarkProps = {
  className?: string;
  /** Decorative by default; pass a title when it stands alone as the logo. */
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
      {/* The circle of the tradition, open at the crown where the lineage
          enters. */}
      <path
        d="M47 9.8A52 52 0 1 0 73 9.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* The star: eight points, the vertical rays longest. */}
      <g fill="currentColor">
        <path d="M60 0.5 61.5 9.5 70.5 11 61.5 12.5 60 21.5 58.5 12.5 49.5 11 58.5 9.5Z" />
        <path d="M60 3.5 60.7 10.3 67.5 11 60.7 11.7 60 18.5 59.3 11.7 52.5 11 59.3 10.3Z" opacity="0.55" transform="rotate(45 60 11)" />
      </g>

      {/* Canopy — 30 leaves on nested arcs, densest at the crown. */}
      <g fill="currentColor" opacity="0.92">
        <path d="M21.3 46.3Q30.3 45.4 35.6 51.4Q27.7 52.7 21.3 46.3Z" />
        <path d="M25.1 33.9Q34.0 35.8 37.2 43.1Q29.3 42.0 25.1 33.9Z" />
        <path d="M33.7 23.7Q41.7 28.1 42.5 36.1Q35.3 32.6 33.7 23.7Z" />
        <path d="M45.9 16.9Q52.1 23.5 50.5 31.4Q44.7 25.9 45.9 16.9Z" />
        <path d="M60.0 14.5Q63.9 22.7 60.0 29.7Q56.1 22.7 60.0 14.5Z" />
        <path d="M74.1 16.9Q75.3 25.9 69.5 31.4Q67.9 23.5 74.1 16.9Z" />
        <path d="M86.3 23.7Q84.7 32.6 77.5 36.1Q78.3 28.1 86.3 23.7Z" />
        <path d="M94.9 33.9Q90.7 42.0 82.8 43.1Q86.0 35.8 94.9 33.9Z" />
        <path d="M98.7 46.3Q92.3 52.7 84.4 51.4Q89.7 45.4 98.7 46.3Z" />
        <path d="M28.1 44.8Q36.5 44.4 41.1 50.2Q33.7 51.0 28.1 44.8Z" />
        <path d="M32.7 33.9Q40.8 36.3 43.2 43.3Q35.9 41.7 32.7 33.9Z" />
        <path d="M41.6 25.5Q48.5 30.5 48.4 37.9Q42.2 33.9 41.6 25.5Z" />
        <path d="M53.5 21.0Q58.4 27.9 55.9 34.9Q51.3 29.1 53.5 21.0Z" />
        <path d="M66.5 21.0Q68.7 29.1 64.1 34.9Q61.6 27.9 66.5 21.0Z" />
        <path d="M78.4 25.5Q77.8 33.9 71.6 37.9Q71.5 30.5 78.4 25.5Z" />
        <path d="M87.3 33.9Q84.1 41.7 76.8 43.3Q79.2 36.3 87.3 33.9Z" />
        <path d="M91.9 44.8Q86.3 51.0 78.9 50.2Q83.5 44.4 91.9 44.8Z" />
        <path d="M35.7 43.4Q43.4 43.7 47.2 49.4Q40.4 49.5 35.7 43.4Z" />
        <path d="M40.8 34.7Q47.9 37.8 49.4 44.4Q43.0 42.2 40.8 34.7Z" />
        <path d="M49.4 28.8Q55.0 34.2 54.0 40.9Q48.8 36.5 49.4 28.8Z" />
        <path d="M60.0 26.7Q63.3 33.7 60.0 39.7Q56.7 33.7 60.0 26.7Z" />
        <path d="M70.6 28.8Q71.2 36.5 66.0 40.9Q65.0 34.2 70.6 28.8Z" />
        <path d="M79.2 34.7Q77.0 42.2 70.6 44.4Q72.1 37.8 79.2 34.7Z" />
        <path d="M84.3 43.4Q79.6 49.5 72.8 49.4Q76.6 43.7 84.3 43.4Z" />
        <path d="M43.4 42.8Q50.4 43.9 53.2 49.4Q47.0 48.9 43.4 42.8Z" />
        <path d="M50.1 35.7Q55.8 39.9 55.7 46.2Q50.5 42.8 50.1 35.7Z" />
        <path d="M60.0 33.0Q63.0 39.4 60.0 44.9Q57.0 39.4 60.0 33.0Z" />
        <path d="M69.9 35.7Q69.5 42.8 64.3 46.2Q64.2 39.9 69.9 35.7Z" />
        <path d="M76.6 42.8Q73.0 48.9 66.8 49.4Q69.6 43.9 76.6 42.8Z" />
        <path d="M60.0 10.6Q64.0 19.0 60.0 26.1Q56.0 19.0 60.0 10.6Z" />
      </g>

      {/* Hanging strands with beads — the detail that makes the mark
          recognisably yours rather than a generic tree-of-life. */}
      <g stroke="currentColor" strokeWidth="0.55" opacity="0.6" strokeDasharray="1.2 1.6">
        <path d="M33 63v18" />
        <path d="M39.5 67v14" />
        <path d="M46 70v10" />
        <path d="M52 72v7" />
        <path d="M68 72v7" />
        <path d="M74 70v10" />
        <path d="M80.5 67v14" />
        <path d="M87 63v18" />
      </g>
      <g fill="currentColor" opacity="0.75">
        <path d="M33 81l1.5 2.4-1.5 2.4-1.5-2.4Z" />
        <path d="M39.5 81l1.5 2.4-1.5 2.4-1.5-2.4Z" />
        <path d="M46 80l1.5 2.4-1.5 2.4-1.5-2.4Z" />
        <path d="M52 79l1.5 2.4-1.5 2.4-1.5-2.4Z" />
        <path d="M68 79l1.5 2.4-1.5 2.4-1.5-2.4Z" />
        <path d="M74 80l1.5 2.4-1.5 2.4-1.5-2.4Z" />
        <path d="M80.5 81l1.5 2.4-1.5 2.4-1.5-2.4Z" />
        <path d="M87 81l1.5 2.4-1.5 2.4-1.5-2.4Z" />
      </g>

      {/* Trunk — two strands twisting, as in the original. */}
      <g stroke="currentColor" strokeLinecap="round" fill="none">
        <path d="M57.6 20c-1.4 12 2.6 20 2.2 30-.4 10-4 16-3.2 26" strokeWidth="2" />
        <path d="M62.4 20c1.4 12-2.6 20-2.2 30 .4 10 4 16 3.2 26" strokeWidth="2" />
      </g>

      {/* Branches. */}
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.9">
        <path d="M59 40C55 36 48 34 42 31" />
        <path d="M61 40c4-4 11-6 17-9" />
        <path d="M58.6 50C54 48 47 47 40 44" />
        <path d="M61.4 50c4.6-2 11.6-3 18.6-6" />
        <path d="M58.6 59C54 58 48 57.5 43 55" />
        <path d="M61.4 59c4.6-1 10.6-1.5 15.6-4" />
      </g>

      {/* Roots, spreading over the page. */}
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.95">
        <path d="M56.6 76c-3 4-9 6-14 7.5" />
        <path d="M63.4 76c3 4 9 6 14 7.5" />
        <path d="M57.8 76c-1.6 5-4 8.5-6 12" />
        <path d="M62.2 76c1.6 5 4 8.5 6 12" />
        <path d="M60 76v15" />
        <path d="M52 80c-3 2.6-7.6 3.6-11.6 4.2" />
        <path d="M68 80c3 2.6 7.6 3.6 11.6 4.2" />
      </g>

      {/* The open book — the śāstra the tree grows out of. */}
      <g fill="none" stroke="currentColor" strokeLinejoin="round">
        <path d="M60 95.5C53 90.6 38 88.4 24.5 89.6v15.9C38 104.3 53 106.5 60 111.4Z" strokeWidth="1.6" />
        <path d="M60 95.5c7-4.9 22-7.1 35.5-5.9v15.9c-13.5-1.2-28.5 1-35.5 5.9Z" strokeWidth="1.6" />
        <path d="M60 95.5v15.9" strokeWidth="1.2" opacity="0.7" />
      </g>
      <g stroke="currentColor" strokeWidth="0.7" opacity="0.4" fill="none">
        <path d="M31 94.6c8 0 17.5 1.8 23 4.6" />
        <path d="M31 99.4c8 0 17.5 1.8 23 4.6" />
        <path d="M89 94.6c-8 0-17.5 1.8-23 4.6" />
        <path d="M89 99.4c-8 0-17.5 1.8-23 4.6" />
      </g>
    </svg>
  );
}
