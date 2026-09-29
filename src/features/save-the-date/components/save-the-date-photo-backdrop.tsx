import Image from "next/image";

interface SaveTheDatePhotoBackdropProps {
  readonly photoUrl: string;
}

export function SaveTheDatePhotoBackdrop({ photoUrl }: SaveTheDatePhotoBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[44rem] overflow-hidden mask-b-from-45% mask-b-to-100% sm:h-[52rem] lg:h-[60rem] 2xl:h-[68rem]"
    >
      <Image
        src={photoUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_20%] opacity-[0.15] mix-blend-multiply grayscale sepia-[0.55]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_62%,var(--color-ivory)_0%,transparent_55%)] opacity-70" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ivory to-transparent" />
    </div>
  );
}
