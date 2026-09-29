import type { ComponentType, SVGProps } from "react";
import { Clock, MapPin } from "lucide-react";
import type { GraduationEventDetails } from "@/features/graduation/domain/graduation";
import { HangerIcon } from "./hanger-icon";

interface EventDetailsProps {
  readonly details: GraduationEventDetails;
}

interface EventDetailItem {
  readonly label: string;
  readonly value: string;
  readonly Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export function EventDetails({ details }: EventDetailsProps) {
  const detailItems: readonly EventDetailItem[] = [
    { label: "Horário", value: details.time ?? "A confirmar", Icon: Clock },
    { label: "Local", value: details.location ?? "Em breve", Icon: MapPin },
    { label: "Traje", value: details.dressCode ?? "A confirmar", Icon: HangerIcon },
  ];

  return (
    <section aria-labelledby="event-details-title" className="w-full text-center">
      <h2 id="event-details-title" className="font-serif text-3xl text-forest sm:text-4xl 2xl:text-5xl">
        Cada detalhe do nosso encontro
      </h2>

      <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-3 divide-x divide-gold-soft/70">
        {detailItems.map(({ label, value, Icon }) => (
          <div key={label} className="flex flex-col items-center px-2 py-1 sm:px-6">
            <Icon className="size-7 text-gold sm:size-8" strokeWidth={1.2} />
            <dt className="mt-3 font-serif text-lg text-forest sm:text-xl">{label}</dt>
            <dd className="mt-0.5 text-sm text-ink-soft sm:text-base">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mx-auto mt-7 max-w-md text-sm text-ink-soft">
        Assim que tudo estiver definido, as novidades aparecem aqui para você.
      </p>
    </section>
  );
}
