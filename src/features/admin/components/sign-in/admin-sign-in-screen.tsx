import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BotanicalBackdrop } from "@/components/brand/botanical-backdrop";
import { Signature } from "@/components/brand/signature";
import { ROUTES } from "@/lib/routes";
import { AdminSignInForm } from "./admin-sign-in-form";

interface AdminSignInScreenProps {
  readonly graduateName: string;
  readonly graduatePhotoUrl: string;
}

export function AdminSignInScreen({ graduateName, graduatePhotoUrl }: AdminSignInScreenProps) {
  return (
    <main className="relative flex min-h-svh flex-1 items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
      <BotanicalBackdrop />

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-lg border border-gold-soft/60 bg-paper shadow-[0_40px_80px_-40px_rgba(21,51,38,0.55)] md:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[34rem] md:block">
          <Image
            src={graduatePhotoUrl}
            alt={`Retrato de ${graduateName}`}
            fill
            sizes="(min-width: 768px) 420px, 0px"
            className="object-cover object-[50%_25%]"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-forest-deep/75 via-forest-deep/10 to-transparent" />
          <div className="absolute inset-x-8 bottom-8 text-paper">
            <p className="text-[0.65rem] uppercase tracking-[0.32em] text-gold-soft">Formatura • Psicologia 2027</p>
            <p className="mt-3 font-serif text-2xl leading-snug">
              Cada detalhe desta celebração, <em className="italic text-gold-soft">nas suas mãos.</em>
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-gold">Acesso restrito</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-forest sm:text-4xl">
            Olá, <em className="italic text-gold">{graduateName}</em>
          </h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            Entre para criar convites, acompanhar as confirmações e cuidar da sua lista de presentes.
          </p>

          <div className="mt-8">
            <AdminSignInForm />
          </div>

          <div className="mt-8 flex items-end justify-between gap-4 border-t border-gold-soft/50 pt-6">
            <Link
              href={ROUTES.home}
              className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-forest"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
              Voltar ao site
            </Link>
            <Signature name={graduateName} className="text-4xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
