import { Reveal } from "@/components/motion/reveal";

/**
 * Page header. Ink ground, so every page opens at the same threshold the home
 * page does and the sitewide navigation always sits on dark.
 */
export function PageHeader({
  eyebrow,
  title,
  devanagari,
  lede,
}: {
  eyebrow: string;
  title: string;
  devanagari?: string;
  lede?: string;
}) {
  return (
    <section className="ink">
      <div className="mx-auto max-w-6xl px-6 pt-40 pb-20">
        <Reveal as="p" className="text-gold-500 text-xs tracking-[0.32em] uppercase">
          {eyebrow}
        </Reveal>
        {devanagari ? (
          <Reveal as="p" delay={50} lang="sa" className="deva text-gold-500 mt-6 text-xl">
            {devanagari}
          </Reveal>
        ) : null}
        <Reveal as="h1" delay={80} className="mt-4 max-w-(--spacing-measure-wide) text-4xl leading-[1.08]">
          {title}
        </Reveal>
        {lede ? (
          <Reveal
            as="p"
            delay={140}
            className="text-ink-muted mt-7 max-w-(--spacing-measure) text-lg leading-relaxed"
          >
            {lede}
          </Reveal>
        ) : null}
      </div>
      <div className="rule-gold" />
    </section>
  );
}
