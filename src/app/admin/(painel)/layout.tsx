import { AdminShell } from "@/features/admin/components/shell/admin-shell";
import { requireAdmin } from "@/features/admin/server/admin-session";
import { graduate } from "@/features/graduation/data/graduation";

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <AdminShell graduateName={graduate.name} adminEmail={admin.email}>
      {children}
    </AdminShell>
  );
}
