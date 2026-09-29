import Image from "next/image";
import type { CSSProperties } from "react";
import { JOURNEY_GALLERY_ANCHOR } from "@/lib/routes";
import type { JourneyPhoto } from "../domain/journey-photo";

interface JourneyPhotoCarouselProps {
  readonly photos: readonly JourneyPhoto[];
}

type MarqueeStyle = CSSProperties & { readonly "--marquee-duration": string };

const SECONDS_PER_PHOTO = 7;

interface JourneyPhotoSlideProps {
  readonly photo: JourneyPhoto;
  readonly isDuplicate: boolean;
}

function JourneyPhotoSlide({ photo, isDuplicate }: JourneyPhotoSlideProps) {
  return (
    <li aria-hidden={isDuplicate || undefined} className="shrink-0 pr-5 sm:pr-7">
      <figure className="flex flex-col items-center">
        <div
          className="h-[20rem] max-w-[85vw] rounded-sm border border-gold-soft bg-paper p-1.5 shadow-[0_28px_50px_-30px_rgba(21,51,38,0.55)] sm:h-[24rem] lg:h-[28rem] 2xl:h-[32rem]"
          style={{ aspectRatio: `${photo.image.width} / ${photo.image.height}` }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[1px] bg-sage/40">
            <Image
              src={photo.image}
              alt={isDuplicate ? "" : photo.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 720px, 85vw"
              className="object-cover"
              style={{ objectPosition: photo.objectPosition ?? "50% 50%" }}
            />
          </div>
        </div>
        <figcaption className="mt-4 max-w-[85vw] text-center font-serif text-sm italic text-forest sm:text-base">
          {photo.caption}
        </figcaption>
      </figure>
    </li>
  );
}

export function JourneyPhotoCarousel({ photos }: JourneyPhotoCarouselProps) {
  const marqueeStyle: MarqueeStyle = { "--marquee-duration": `${photos.length * SECONDS_PER_PHOTO}s` };

  return (
    <section id={JOURNEY_GALLERY_ANCHOR} aria-labelledby="journey-gallery-title" className="scroll-mt-8">
      <div className="text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gold lg:text-xs">Memórias</p>
        <h2 id="journey-gallery-title" className="mt-3 font-serif text-3xl text-forest sm:text-4xl lg:text-5xl">
          A jornada até aqui
        </h2>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">Os momentos que me trouxeram até este novo começo.</p>
      </div>

      <div className="relative mx-[calc(50%-50vw)] mt-10 overflow-hidden pb-2 pt-1 lg:mt-14">
        <ul
          aria-label="Fotos da jornada"
          style={marqueeStyle}
          className="flex w-max animate-marquee hover:[animation-play-state:paused]"
        >
          {photos.map((photo) => (
            <JourneyPhotoSlide key={photo.id} photo={photo} isDuplicate={false} />
          ))}
          {photos.map((photo) => (
            <JourneyPhotoSlide key={`${photo.id}-loop`} photo={photo} isDuplicate />
          ))}
        </ul>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-ivory to-transparent sm:w-24 lg:w-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-ivory to-transparent sm:w-24 lg:w-40"
        />
      </div>
    </section>
  );
}
