import type { StaticImageData } from "next/image";

export interface JourneyPhoto {
  readonly id: string;
  readonly image: StaticImageData;
  readonly alt: string;
  readonly caption: string;
  readonly objectPosition?: string;
}
