import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { BotanicalSprig } from "@/components/brand/botanical-sprig";
import { ROUTES } from "@/lib/routes";
import { signOutAdminAction } from "../../actions/admin-auth-actions";
import { AdminSidebarNavigation, AdminTabBarNavigation } from "./admin-navigation";

interface AdminShellProps {
  readonly graduateName: string;
  readonly adminEmail: string;
  readonly children: ReactNode;
}

function AdminBrand({ graduateName, isOnDarkSurface }: { readonly graduateName: string; readonly isOnDarkSurface: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="relative flex items-center">
        <BotanicalSprig className="absolute -left-3 top-0.5 w-6 -rotate-[30deg] opacity-80" />
        <span className={`relative font-serif text-4xl leading-none ${isOnDarkSurface ? "text-paper" : "text-forest"}`}>
          {graduateName.charAt(0)}
        </span>
      </span>
      <span className={`h-9 w-px ${isOnDarkSurface ? "bg-gold-soft/50" : "bg-gold-soft"}`} />
      <span className="leading-none">
        <span className={`block font-serif text-2xl ${isOnDarkSurface ? "text-paper" : "text-forest"}`}>{graduateName}</span>
        <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.3em] text-gold-soft">Painel</span>
      </span>
    </span>
  );
}

function SignOutButton({ className, label }: { readonly className: string; readonly label?: string }) {
  return (
    <form action={signOutAdminAction}>
      <button type="submit" className={className} aria-label={label ? undefined : "Sair do painel"}>
        <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {label}
      </button>
    </form>
  );
}

export function AdminShell({ graduateName, adminEmail, children }: AdminShellProps) {
  return (
    <div className="relative flex min-h-svh flex-1">
      <aside className="sticky top-0 hidden h-svh w-72 shrink-0 flex-col overflow-hidden bg-forest-deep px-5 py-8 lg:flex">
        <BotanicalSprig className="pointer-events-none absolute -bottom-6 -right-10 w-44 -rotate-[150deg] opacity-15" />
        <Link href={ROUTES.home} className="px-2" aria-label="Voltar ao site">
          <AdminBrand graduateName={graduateName} isOnDarkSurface />
        </Link>

        <div className="mt-10 flex-1">
          <p className="mb-3 px-3.5 text-[0.62rem] uppercase tracking-[0.3em] text-paper/40">Seu cantinho</p>
          <AdminSidebarNavigation />
        </div>

        <div className="relative space-y-4 border-t border-paper/10 pt-5">
          <Link
            href={ROUTES.home}
            target="_blank"
            className="flex items-center gap-2 px-3.5 text-sm text-paper/65 transition-colors hover:text-paper"
          >
            <ExternalLink className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Ver o site
          </Link>
          <div className="rounded-md bg-paper/5 px-3.5 py-3">
            <p className="truncate text-xs text-paper/55" title={adminEmail}>
              {adminEmail}
            </p>
            <SignOutButton
              label="Sair"
              className="mt-2 inline-flex items-center gap-2 text-sm text-gold-soft transition-colors hover:text-paper"
            />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gold-soft/50 bg-ivory/90 px-5 py-3.5 backdrop-blur lg:hidden">
          <Link href={ROUTES.home} aria-label="Voltar ao site">
            <AdminBrand graduateName={graduateName} isOnDarkSurface={false} />
          </Link>
          <SignOutButton className="flex size-10 items-center justify-center rounded-full border border-gold-soft/70 text-forest transition-colors hover:bg-paper" />
        </header>

        <main className="relative flex-1 px-5 pb-28 pt-6 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12 2xl:px-16">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      <AdminTabBarNavigation />
    </div>
  );
}
