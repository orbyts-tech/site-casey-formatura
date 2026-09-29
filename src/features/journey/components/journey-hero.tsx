import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { ButtonLink } from "@/components/ui/button";
import type { Graduate } from "@/features/graduation/domain/graduation";
import { JOURNEY_GALLERY_ANCHOR, ROUTES } from "@/lib/routes";

interface JourneyHeroProps {
  readonly graduate: Graduate;
}

export function JourneyHero({ graduate }: JourneyHeroProps) {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
      <FadeIn className="text-center lg:text-left">
        <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gold lg:text-xs 2xl:text-sm">
          Cada passo, uma conquista
        </p>
        <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.08] text-forest sm:text-6xl lg:text-7xl 2xl:text-8xl">
          Um sonho que
          <br />
          ganha <em>novos</em>
          <br />
          <em>começos.</em>
        </h1>
        <p className="mt-5 text-base text-ink-soft sm:text-lg 2xl:text-xl">
          Essa história fica ainda mais bonita com você.
        </p>

        <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:justify-start">
          <ButtonLink
            href={ROUTES.invitation}
            trailingIcon={<ArrowUpRight className="size-4" strokeWidth={1.5} />}
            className="w-full sm:w-auto sm:min-w-56"
          >
            Abrir meu convite
          </ButtonLink>
          <a
            href={`#${JOURNEY_GALLERY_ANCHOR}`}
            className="group inline-flex items-center gap-2 border-b border-gold pb-1 font-serif text-base text-forest transition-colors hover:border-forest"
          >
            Conhecer a jornada
            <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={1.4} />
          </a>
        </div>
      </FadeIn>

      <FadeIn delay={0.2} className="flex justify-center lg:justify-end">
        <figure className="flex w-full max-w-[18rem] flex-col items-center sm:max-w-[20rem] lg:max-w-[24rem] 2xl:max-w-[28rem]">
          <div className="w-full rounded-t-full border border-gold-soft p-2 lg:p-2.5">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-full bg-sage/40">
              <Image
                src={graduate.gownPhotoUrl}
                alt={`${graduate.name} com a beca de formatura`}
                fill
                priority
                sizes="(min-width: 1536px) 448px, (min-width: 1024px) 384px, 320px"
                className="object-cover object-top"
              />
            </div>
          </div>
          <figcaption className="mt-3 text-xs text-ink-soft sm:text-sm">
            {graduate.name} · Formatura em {graduate.course}
          </figcaption>
        </figure>
      </FadeIn>
    </section>
  );
}
